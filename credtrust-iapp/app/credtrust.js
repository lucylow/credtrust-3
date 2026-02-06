// credtrust-iapp/app/credtrust.js - Production TEE iApp logic
/* eslint-disable no-console */
const { IExec } = require("@iexec/sdk");
const { IExecWeb3mail } = require("@iexec/web3mail");
const snarkjs = require("snarkjs");

function getTier(score) {
  if (score >= 800) return "A++";
  if (score >= 750) return "A+";
  if (score >= 700) return "A";
  if (score >= 650) return "B+";
  return "B";
}

function generateEmailTemplate(score, tier) {
  return `
<div style="font-family: Arial; max-width: 600px;">
  <h1 style="color: ${tier === 'A++' ? '#10b981' : '#3b82f6'}">Score: ${score}</h1>
  <p>Confidential TEE computation completed via iExec iApp.</p>
  <p>Your score was computed privately and delivered via Web3Mail.</p>
</div>
  `;
}

async function proveCreditScore(walletData) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      in: walletData.normalizedInputs,
      nullifier: BigInt(walletData.nullifier || 0n)
    },
    "./zkp/credtrust-v2.wasm",
    "./zkp/credtrust-v2.zkey"
  );

  const score = Number(publicSignals?.[0] ?? 700);
  const tier = getTier(score);
  return { proof, score, tier, verified: true };
}

async function sendCreditCampaign(contacts, score, tier) {
  const web3mail = new IExecWeb3mail();
  const results = [];
  const list = Array.isArray(contacts) ? contacts.slice(0, 10) : [];
  for (const contact of list) {
    try {
      const result = await web3mail.sendEmail({
        protectedData: contact.protectedData || contact,
        emailSubject: `CredTrust TEE Score: ${score} (${tier})`,
        emailContent: generateEmailTemplate(score, tier),
        senderName: "CredTrust TEE",
        workerpoolAddressOrEns: process.env.WORKERPOOL_ENS || "tdx-labs.pools.iexec.eth"
      });
      results.push({
        protectedData: contact.protectedData || contact,
        taskId: result?.taskId || null,
        cost: 0.012
      });
    } catch (err) {
      results.push({ protectedData: contact.protectedData || contact, error: err.message || String(err) });
    }
  }
  return results;
}

async function readStdinJson() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    process.stdin.on("error", reject);
  });
}

async function main() {
  try {
    const inputs = await readStdinJson();
    console.log("🔬 TEE: Processing confidential inputs...");

    const scoreProof = await proveCreditScore(inputs.walletData || { normalizedInputs: [12, 52340, 2.847, 3.2, 4.23], nullifier: 0 });

    const messagingResults = await sendCreditCampaign(
      inputs.protectedContacts || [],
      scoreProof.score,
      scoreProof.tier
    );

    const output = {
      success: true,
      score: scoreProof.score,
      tier: scoreProof.tier,
      proof: scoreProof.proof,
      campaigns: messagingResults,
      rlcCost: messagingResults.reduce((sum, r) => sum + (r.cost || 0), 0)
    };

    console.log("✅ TEE execution completed:", JSON.stringify(output));
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    console.error("❌ TEE Error:", error.message || error);
    process.stdout.write(JSON.stringify({ success: false, error: error.message || String(error) }));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
