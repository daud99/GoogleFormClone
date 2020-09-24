const express = require('express')
const app = express()

const { graphqlHTTP } = require('express-graphql');
import schema from './graphQL/schema'

const auth = require("./auth.js")
const siteConfig = require('./config/site.js')
const dbConfig = require('./config/db.js');


async function ignite() {
    try {
        await dbConfig.connect();
        auth.initialize(app);

        app.get("/", (req,res,next)=>{
            res.send("hello daud");
        });
        
        app.use(auth.graphQLAuthentication);
        
        app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: true,
            pretty: true
        }));

        app.listen(siteConfig.serverPort, () => {
            console.log(`SocDash active at ${siteConfig.serverPort}!`);
        });
    }
    catch (e) {
        console.log("FATAL IGNITION ERROR");
        console.log(e);
    }
}

ignite();

