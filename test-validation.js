import {
  listMatchesQuerySchema,
  MATCH_STATUS,
  matchIdParamSchema,
  createMatchSchema,
  updateScoreSchema,
} from "./src/validation/matches.js";

console.log("=== Testing Zod Validation Schemas ===\n");

// Test 1: listMatchesQuerySchema
console.log("1. Testing listMatchesQuerySchema:");
try {
  const result1 = listMatchesQuerySchema.parse({ limit: "50" });
  console.log("✅ Valid limit (coerced):", result1);
  
  const result2 = listMatchesQuerySchema.parse({});
  console.log("✅ Optional limit:", result2);
  
  try {
    listMatchesQuerySchema.parse({ limit: "150" });
  } catch (err) {
    console.log("✅ Correctly rejected limit > 100:", err.issues[0].message);
  }
} catch (err) {
  console.log("❌ Error:", err.errors);
}

// Test 2: MATCH_STATUS
console.log("\n2. Testing MATCH_STATUS:");
console.log("✅ Constants:", MATCH_STATUS);

// Test 3: matchIdParamSchema
console.log("\n3. Testing matchIdParamSchema:");
try {
  const result = matchIdParamSchema.parse({ id: "123" });
  console.log("✅ Valid id (coerced):", result);
  
  try {
    matchIdParamSchema.parse({ id: "-5" });
  } catch (err) {
    console.log("✅ Correctly rejected negative id:", err.issues[0].message);
  }
} catch (err) {
  console.log("❌ Error:", err.errors);
}

// Test 4: createMatchSchema
console.log("\n4. Testing createMatchSchema:");
try {
  const validMatch = {
    sport: "Football",
    homeTeam: "Team A",
    awayTeam: "Team B",
    startTime: "2026-02-05T10:00:00Z",
    endTime: "2026-02-05T12:00:00Z",
    homeScore: "2",
    awayScore: "1",
  };
  const result = createMatchSchema.parse(validMatch);
  console.log("✅ Valid match created:", result);
  
  // Test invalid ISO date
  try {
    createMatchSchema.parse({
      ...validMatch,
      startTime: "not-a-date",
    });
  } catch (err) {
    console.log("✅ Correctly rejected invalid ISO date:", err.issues[0].message);
  }
  
  // Test endTime before startTime
  try {
    createMatchSchema.parse({
      sport: "Football",
      homeTeam: "Team A",
      awayTeam: "Team B",
      startTime: "2026-02-05T12:00:00Z",
      endTime: "2026-02-05T10:00:00Z",
    });
  } catch (err) {
    console.log("✅ Correctly rejected endTime before startTime:", err.issues[0].message);
  }
  
  // Test empty string
  try {
    createMatchSchema.parse({
      ...validMatch,
      sport: "",
    });
  } catch (err) {
    console.log("✅ Correctly rejected empty sport string:", err.issues[0].message);
  }
} catch (err) {
  console.log("❌ Error:", err.errors);
}

// Test 5: updateScoreSchema
console.log("\n5. Testing updateScoreSchema:");
try {
  const result = updateScoreSchema.parse({ homeScore: "3", awayScore: "2" });
  console.log("✅ Valid scores (coerced):", result);
  
  try {
    updateScoreSchema.parse({ homeScore: "-1", awayScore: "2" });
  } catch (err) {
    console.log("✅ Correctly rejected negative score:", err.issues[0].message);
  }
  
  try {
    updateScoreSchema.parse({ homeScore: "2" });
  } catch (err) {
    console.log("✅ Correctly rejected missing required field:", err.issues[0].message);
  }
} catch (err) {
  console.log("❌ Error:", err.errors);
}

console.log("\n=== All tests completed ===");
