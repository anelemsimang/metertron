import postgres from "postgres";

const password = process.env.DATABASE_URL?.match(/postgresql:\/\/[^:]+:([^@]+)@/)?.[1];
if (!password) {
  console.error("no password");
  process.exit(1);
}

const ref = "xpnyyekfzajcmprvwuco";
const candidates = [
  `postgresql://postgres.${ref}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`,
  `postgresql://postgres.${ref}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`,
  `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres?sslmode=require`,
  `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`,
];

async function main() {
  for (const url of candidates) {
    const secret = password!;
    const label = url.replaceAll(secret, "***").replaceAll(encodeURIComponent(secret), "***");
    const sql = postgres(url, { max: 1, connect_timeout: 12, prepare: false, ssl: "require" });
    try {
      await sql`select current_user as u, current_database() as d`;
      console.log("CONNECTED", label);
      await sql.end({ timeout: 1 });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : String(error);
      console.log("fail", label, "=>", message);
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
