const neo4j = require('neo4j-driver');

exports.handler = async (event, context) => {
  // Use .trim() to wipe out any invisible spaces from the environment variables
  const uri = "neo4j+s://e51ffb21.databases.neo4j.io";
  const user = "neo4j";
  const password ="pOP08DS_Mw-oDLn6XSdg-wVsJS1GCnBoRksqPKqxBZw";

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    const result = await session.run('MATCH (t:Turtle) RETURN t');
    const turtles = result.records.map(row => row.get('t').properties);
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turtles),
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  } finally {
    await session.close();
    await driver.close();
  }
};
