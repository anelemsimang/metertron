import postgres from "postgres";

const raw = process.env.DATABASE_URL?.trim();
if (!raw) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

const passwordMatch = raw.match(/postgresql:\/\/[^:]+:([^@]+)@/);
const password = passwordMatch?.[1];
if (!password) {
  console.error("Could not parse password");
  process.exit(1);
}

const ref = "xpnyyekfzajcmprvwuco";
const regions = ["eu-west-1", "eu-central-1", "eu-west-2", "us-east-1", "ap-southeast-1"];

async function main() {
  for (const region of regions) {
    const url = `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?sslmode=require`;
    const sql = postgres(url, { max: 1, connect_timeout: 10, prepare: false, ssl: "require" });
    try {
      await sql`select 1 as ok`;
      console.log(`CONNECTED ${region}`);
      await sql.end({ timeout: 1 });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
      console.log(`fail ${region}: ${message}`);
      try {
        await sql.end({ timeout: 1 });
      } catch {
        /* ignore */
      }
    }
  }
  process.exit(1);
}

main();
