var forecastData;
var apiKey = '608cafddfa3b4ce745e5d3142925597b';
var message; 

function setup() {
  createCanvas( 375, 667 );
  img = loadImage( "assets/cancun2.jpg");
  
}

function draw() {
  //back image
  background(255);
  img.resize( 0, height);
  image( img, -300 ,0 );
  tint( 255, 200);
  
  //font heading 
  textAlign( CENTER, CENTER);
  textFont( fontMISO);
  noStroke();
  fill(255);
  textSize(30);
  text("CANCUN", width/2, 1/15*height);
  
  //font heading two 
  textSize(22);
  text("Beachy Tropics", width/2, 1/10 * height);
  
  //plot lines
  stroke(255);
  plotTempRange(getTempRange());
  noStroke();
  fill(color(255, 150));
  plotTempShape(getTempRange());
 
  avgHighLow = getAvgHighLow(getTempRange());
  //avg high low headers 
  textSize(20);
  fill(255);
  text( "average high: " + round(avgHighLow[0]), width/2, 7/40 *height);
  text( "average low: " + round(avgHighLow[1]), width/2, 22/40*height);
  
  
}

function getTempRange() {
  var tempHigh = [];
  var tempLow = []; 
  for( var i = 0; i < 7; i++){
    append( tempHigh, forecastData.daily.data[i].temperatureMax);
    append( tempLow, forecastData.daily.data[i].temperatureMin);
  }
  tempRange = [ tempHigh, tempLow];
  return tempRange;
}

function plotTempRange(tempRange) {
  var tempMin = min(tempRange[1]);
  var tempMax = max(tempRange[0]);
  var increment = width/(tempRange[1].length+1);
  for(var i = 0; i< tempRange[1].length; i++){
    x = increment * (i+1);
    ylow = map(tempRange[1][i], tempMin, tempMax, height/2, 2/10*height);
    ymax = map(tempRange[0][i], tempMin, tempMax, height/2, 2/10*height);
    line(x, ylow, x, ymax);
  };
  
};

function plotTempShape(tempRange){
  var tempMin = min(tempRange[1]);
  var tempMax = max(tempRange[0]);
  var increment = width/(tempRange[1].length+1);
  beginShape();
  for(var i = 0; i< tempRange[1].length; i++){ //min
    x = increment * (i+1);
    ylow = map(tempRange[1][i], tempMin, tempMax, height/2, 2/10*height);
    vertex(x, ylow);
  };
  for(var i = tempRange[1].length; i>= 0; i--){ //min
    x = increment * (i+1);
    ymax = map(tempRange[0][i], tempMin, tempMax, height/2, 2/10*height);
    vertex(x, ymax);
  };
  endShape(CLOSE);
}

function getAvgHighLow(tempRange){
  var sumHigh = 0;
  var sumLow = 0;
  for( var i = 0; i < tempRange[1].length; i++) {
    sumHigh += tempRange[0][i];
    sumLow += tempRange[1][i];
  }
  avgHighLow = [sumHigh/7, sumLow/7];
  return avgHighLow;
}


//stuff

function preload() {
  fontMISO = loadFont("assets/miso.OTF");
  if (apiKey) {
    var url = 'https://api.forecast.io/forecast/'
            + apiKey + '/21.1606,-86.8475';
    loadJSON(url, loadCallback, 'jsonp');
  }
  else {
    loadJSON('cachedForecastForBoston.json', loadCallback);
  }
}

function loadCallback(data) {
  forecastData = data;
  
  // Reformat current date
  if (forecastData.currently) {
    forecastData.currently.time =
      formatTime(forecastData.currently.time);
  }
  
  // Reformat minute date
  if (forecastData.minutely && forecastData.minutely.data) {
    for (minuteIdx = 0; minuteIdx < forecastData.minutely.data.length; minuteIdx++) {
      forecastData.minutely.data[minuteIdx].time = 
        formatTime(forecastData.minutely.data[minuteIdx].time);
    }
  }
  
  // Reformat hourly date
  if (forecastData.hourly && forecastData.hourly.data) {
    for (hourIdx = 0; hourIdx < forecastData.hourly.data.length; hourIdx++) {
      forecastData.hourly.data[hourIdx].time = 
        formatTime(forecastData.hourly.data[hourIdx].time);
    }
  }
  
  // Reformat daily date
  if (forecastData.daily && forecastData.daily.data) {
    var dailyData = forecastData.daily.data
    for (dayIdx = 0; dayIdx < dailyData.length; dayIdx++) {
      dailyData[dayIdx].time = 
        formatTime(dailyData[dayIdx].time);
      
      // sunrise
      if (dailyData[dayIdx].sunriseTime) {
        dailyData[dayIdx].sunriseTime =
          formatTime(dailyData[dayIdx].sunriseTime);
      }
      
      // sunset
      if (dailyData[dayIdx].sunsetTime) {
        dailyData[dayIdx].sunsetTime =
          formatTime(dailyData[dayIdx].sunsetTime);
      }
      
      // max precipitation time
      if (dailyData[dayIdx].precipIntensityMaxTime) {
        dailyData[dayIdx].precipIntensityMaxTime = 
        formatTime(dailyData[dayIdx].precipIntensityMaxTime);
      }
      
      // min temp time
      if (dailyData[dayIdx].temperatureMinTime) {
        dailyData[dayIdx].temperatureMinTime = 
        formatTime(dailyData[dayIdx].temperatureMinTime);
      }
      
      // max temp time
      if (dailyData[dayIdx].temperatureMaxTime) {
        dailyData[dayIdx].temperatureMaxTime = 
        formatTime(dailyData[dayIdx].temperatureMaxTime);
      }
      
      // apparent min temp time
      if (dailyData[dayIdx].apparentTemperatureMinTime) {
        dailyData[dayIdx].apparentTemperatureMinTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMinTime);
      }
      
      // apparent max temp time
      if (dailyData[dayIdx].apparentTemperatureMaxTime) {
        dailyData[dayIdx].apparentTemperatureMaxTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMaxTime);
      }
    }
  }
  
  // Reformat alerts date
  if (forecastData.alerts) {
    for (alertIdx = 0; alertIdx < forecastData.alerts.length; alertIdx++) {
      forecastData.alerts[alertIdx].time = 
        formatTime(forecastData.alerts[alertIdx].time);
    }
  }
  
  // Convenience method for formatting time
  function formatTime(timeField) {
      var d = new Date();
      d.setTime(timeField*1000);
      return d;
  }
}