const neo4j = require('neo4j-driver');

exports.handler = async (event, context) => {
  // Use .trim() to wipe out any invisible spaces from the environment variables
  const uri = (process.env.NEO4J_URI || "").trim();
  const user = (process.env.NEO4J_USER || "neo4j").trim();
  const password = (process.env.NEO4J_PASSWORD || "").trim();

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
