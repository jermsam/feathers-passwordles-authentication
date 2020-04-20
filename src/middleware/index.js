// eslint-disable-next-line no-unused-vars

const {WebhookClient} = require('dialogflow-fulfillment');
const axios = require('axios');
//weather api
const getWeather = async (key,city) =>{

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
  const {data} = await axios.get(url);
  const {main:{temp},weather} = data;
  const {description}=weather[0];
  if(weather.message==='city not found'){
    return `unable to get weather${weather.message}`;
  }
  return `Right now it’s ${temp} degrees with ${description}`;
};

module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  app.use('/webhook',async (request,response,)=>{
    const key =app.get('weatherApi');

    const agent = new WebhookClient({ request, response });

    const {parameters}=request.body.queryResult;
    const city =parameters['geo-city'];


    let intentMap = new Map();

    const res =await getWeather (key,city);

    const weatherForecaster=agent=>{
      agent.add(res);
    };

    intentMap.set('get.weather', weatherForecaster);
    agent.handleRequest(intentMap);
    // next();
  });
};
