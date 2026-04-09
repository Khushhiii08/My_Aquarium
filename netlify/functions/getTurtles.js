const neo4j = require('neo4j-driver');

exports.handler = async (event, context) => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI.trim(),
    neo4j.auth.basic(
      process.env.NEO4J_USER.trim(), 
      process.env.NEO4J_PASSWORD.trim()
    )
  );
  const session = driver.session();

  try {
    const result = await session.run('MATCH (t:Turtle) RETURN t');
    const turtles = result.records.map(row => row.get('t').properties);
    
    return {
      statusCode: 200,
      body: JSON.stringify(turtles),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  } finally {
    await session.close();
    await driver.close();
  }
};
