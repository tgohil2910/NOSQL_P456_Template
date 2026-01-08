/**
 * MongoDB Auto-Grader for Exercises 1-6 (Querying & Operators)
 * Checks if the student has set up the data correctly to support the required queries.
 */

const { MongoClient } = require("mongodb");

const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "companyDB"; // Specified in Practical 4-6

async function verify() {
  let score = 0;
  const report = [];

  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const employees = db.collection("employees");

    // Fetch all data for analysis
    const docs = await employees.find({}).toArray();
    const count = docs.length;

    /* -------------------------------------------------
       Exercise 1: Data Setup (Database & Collection)
    ------------------------------------------------- */
    if (count >= 5) {
      score += 10;
      report.push("Exercise 1: PASS (Data setup verified)");
    } else {
      report.push(`Exercise 1: FAIL (Expected 5+ documents, found ${count})`);
    }

    /* -------------------------------------------------
       Schema Validation (Required for all queries)
    ------------------------------------------------- */
    if (count > 0) {
      const validSchema = docs.every(d => 
        d.name && typeof d.name === 'string' &&
        d.department && typeof d.department === 'string' &&
        d.salary !== undefined && typeof d.salary === 'number' &&
        d.age !== undefined && typeof d.age === 'number'
      );

      if (validSchema) {
        score += 10;
        report.push("Schema Check: PASS (All fields valid)");
      } else {
        report.push("Schema Check: FAIL (Missing or invalid types for name, department, salary, or age)");
      }
    } else {
      report.push("Schema Check: FAIL (No data found)");
    }

    /* -------------------------------------------------
       Exercise 2: Simple Find Prerequisites
       (Check if "IT" and "Rahul" exist so queries work)
    ------------------------------------------------- */
    const hasIT = docs.some(d => d.department === "IT");
    const hasRahul = docs.some(d => d.name === "Rahul");

    if (hasIT && hasRahul) {
      score += 10;
      report.push("Exercise 2 Data: PASS (Found 'IT' dept and 'Rahul')");
    } else {
      report.push(`Exercise 2 Data: FAIL (Missing 'IT' dept or 'Rahul' in data). IT: ${hasIT}, Rahul: ${hasRahul}`);
    }

    /* -------------------------------------------------
       Exercise 3: Distinct Prerequisites
       (Check if there are multiple departments)
    ------------------------------------------------- */
    const uniqueDepts = new Set(docs.map(d => d.department));
    if (uniqueDepts.size >= 2) {
      score += 10;
      report.push("Exercise 3 Data: PASS (Multiple departments found)");
    } else {
      report.push("Exercise 3 Data: FAIL (Only 1 or 0 departments found)");
    }

    /* -------------------------------------------------
       Exercise 4: Salary Analysis Data ($gt, $lt)
       (Check if salaries > 50000 and < 30000 exist)
    ------------------------------------------------- */
    const hasHighSalary = docs.some(d => d.salary > 50000);
    const hasLowSalary = docs.some(d => d.salary < 30000);

    if (hasHighSalary && hasLowSalary) {
      score += 10;
      report.push("Exercise 4 Data: PASS (Data supports Salary > 50k and < 30k queries)");
    } else {
      report.push("Exercise 4 Data: FAIL (Missing salaries > 50k or < 30k)");
    }

    /* -------------------------------------------------
       Exercise 5: Age Filtering Data ($gte, $lte)
       (Check if age >= 30 and <= 25 exist)
    ------------------------------------------------- */
    const hasSenior = docs.some(d => d.age >= 30);
    const hasJunior = docs.some(d => d.age <= 25);

    if (hasSenior && hasJunior) {
      score += 10;
      report.push("Exercise 5 Data: PASS (Data supports Age >= 30 and <= 25 queries)");
    } else {
      report.push("Exercise 5 Data: FAIL (Missing ages >= 30 or <= 25)");
    }

    /* -------------------------------------------------
       Exercise 6: Range Query Data
       (Check if salary between 40k and 80k exists)
    ------------------------------------------------- */
    const hasMidRange = docs.some(d => d.salary >= 40000 && d.salary <= 80000);

    if (hasMidRange) {
      score += 10;
      report.push("Exercise 6 Data: PASS (Data supports Salary 40k-80k query)");
    } else {
      report.push("Exercise 6 Data: FAIL (No salaries between 40k and 80k)");
    }

  } catch (err) {
    report.push("CRITICAL: Failed to connect or query database. " + err.message);
  } finally {
    /* -------------------------------------------------
       FINAL REPORT
    ------------------------------------------------- */
    console.log("========== MongoDB Query Lab Auto-Report ==========");
    report.forEach(r => console.log(r));
    console.log("---------------------------------------------------");
    console.log(`TOTAL SCORE: ${score} / 70`);

    await client.close();
    process.exit(score === 70 ? 0 : 1);
  }
}

verify();