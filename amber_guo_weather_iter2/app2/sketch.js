var forecastData;
var apiKey = '608cafddfa3b4ce745e5d3142925597b';
MAR_EQ = new Date(2016, 3, 20);
JUNE_SOL = new Date(2016, 6, 20);
SEPT_EQ = new Date(2016, 9, 22);
DEC_SOL = new Date(2016, 12, 21);
spring = "#c4e5d4";
summer = "#64938d";
fall = "#e5a977";
winter = "#3e687e";
date = new Date(2016, 1, 1);
dayDict = {0:"SUNDAY",1:"MONDAY",2:"TUESDAY",3:"WEDNESDAY", 4:"THURSDAY", 5:"FRIDAY", 6:"SATURDAY" };


function setup() {
  createCanvas( 375, 667 );
  heightShift = 0.2*height;
  
  currentDate = new Date(forecastData.currently.time);
  MAR_ANG = getDateAngle(MAR_EQ);
  JUNE_ANG = getDateAngle(JUNE_SOL);
  SEPT_ANG = getDateAngle(SEPT_EQ);
  DEC_ANG = getDateAngle(DEC_SOL);

}

function draw() {
  
  background("#eeeeee");
  
  noStroke();
  fill(color(getCurrentSeason()));
  ellipse( width/2, height/2-heightShift, 3/4*width, 3/4*width);
  
  //draw arc
  push();
  noFill();
  strokeWeight(10)
  //spring
  stroke(spring);
  drawDateArc( MAR_EQ, JUNE_SOL);
  //summer
  stroke(summer);
  drawDateArc( JUNE_SOL, SEPT_EQ);
  //fall
  stroke(fall);
  drawDateArc( SEPT_EQ, DEC_SOL);
  //winter
  stroke(winter);
  drawDateArc( DEC_SOL, MAR_EQ);
  pop();
  
  //text 
  var currentTemp = forecastData.currently.temperature;
  textAlign( CENTER, CENTER);
  textFont( fontMISO);
  noStroke();
  fill(255);
  textSize(20);
  text( dayDict[currentDate.getDay()], width/2, 4/10*height-heightShift);
  textSize(40);
  text( round(currentTemp)+"\xB0F" , width/2, 4.5/10*height-heightShift);
  
  //draw cloud
  fill(255);
  drawCloud(5/15*width, height/2-heightShift+15);
  textSize(20);
  text( forecastData.currently.summary, (1/2+1/15)*width, height/2-heightShift+15);
  push();
  stroke(255);
  strokeWeight(2);
  //drawUmbrella(1/3*width, height/2-heightShift+70);
  pop();
  text( forecastData.currently.precipProbability+'% chance of rain', (1/2)*width, height/2-heightShift+60);
 
  //write month
  push();
  textSize(17);
  fill("#939393");
  text("JAN", width/2, 1/15*height-10);
  text("JULY", width/2, height/2+35);
  text("APRIL", width-20, height/2 - heightShift);
  text("OCT", 20, height/2 - heightShift);
  pop();
  
  
  //rectangle
  fill(getCurrentSeason());
  rect(1/16*width, 1/2*height + 60, 7/8*width, 1.15/3*height, 10);
  
  //plot lines
  stroke(255);
  plotTempRange(getTempRange());
  noStroke();
  fill(color(255,127));
  plotTempShape(getTempRange());
  stroke(getCurrentSeason());
  plotTempRange(getTempRange());
  noStroke();
 
  avgHighLow = getAvgHighLow(getTempRange());
  //avg high low headers 
  textSize(20);
  fill(255);
  text( "average high: " + round(avgHighLow[0])+"\xB0F", width/2, 3.43/5 *height);
  text( "average low: " + round(avgHighLow[1])+"\xB0F", width/2, 4.6/5*height);
  textSize(30);
  text( "WEEKLY FORECAST", width/2, 3.15/5*height);
  
  
  
  
}

function getDateAngle( date ){
  var m = date.getMonth();
  var d = date.getDate();
  var mAngle = radians(map(m, 0, 11, -90, 240));
  var dAngle = radians(map(31-d, 0, 31, 0, 360/12));
  return mAngle-dAngle;
}

function drawDateArc( date1, date2 ){
  arc(width/2, height/2-heightShift, 3/4*width, 3/4*width, getDateAngle(date1)+radians(2), getDateAngle(date2)-radians(2));
}

function getCurrentAngle(){
  return getDateAngle(currentDate);
}

function getCurrentSeason(){
  ang = getCurrentAngle();
  if(ang > MAR_ANG && ang <= JUNE_ANG ){
    return spring;
  } else if ( ang > JUNE_ANG && ang <= SEPT_ANG){
    return summer;
  } else if ( ang > SEPT_ANG && ang <= DEC_ANG ){
    return fall;
  } else {
    return winter;
  }
}

function drawCloud(x,y) {
  ellipse(x-9, y, 15, 15);
  ellipse(x,y,15,15);
  ellipse(x+9, y, 15,15);
  ellipse(x-3, y-6, 15, 15);
}

function drawUmbrella(x,y) {
  arc(x, y-15, 30, 25, radians(-180), 0);
  line(x, y-15, x, y-5);
  
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
    ylow = map(tempRange[1][i], tempMin, tempMax, height/2+2.2*heightShift-30, 2/10*height+2.2*heightShift+30);
    ymax = map(tempRange[0][i], tempMin, tempMax, height/2+2.2*heightShift-30, 2/10*height+2.2*heightShift+30);
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
    ylow = map(tempRange[1][i], tempMin, tempMax, height/2+2.2*heightShift-30, 2/10*height+2.2*heightShift+30);
    vertex(x, ylow);
  };
  for(var i = tempRange[1].length; i>= 0; i--){ //min
    x = increment * (i+1);
    ymax = map(tempRange[0][i], tempMin, tempMax, height/2+2.2*heightShift-30, 2/10*height+2.2*heightShift+30);
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
            + apiKey + '/42.3601,-71.0589';
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