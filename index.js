//////////////// Setup and global variables ////////////////////////////////
GMAIL_SENDER = 'noreply@seatalk.io'
GMAIL_TEXT = "Your following leave application has been approved"
GMAIL_KEYWORD = 	"Leave Type"
DEFAULT_EVENT_TIME = 30
DATE_FORMAT = 'ROW' // US (m/d/y) or ROW (d/m/y)

//////////////////////////////////////////////////////////////////////////// 

// Ref : https://github.com/al-codaio/events-from-gmail/blob/main/create_gcal_events_from_gmail.js

function getEmail() {
  // var thread = GmailApp.getInboxThreads(0,1)[0]; // Get first thread in inbox

  // Find latest approval email from seatalk
  var threads = GmailApp.search('in:inbox from:noreply@seatalk.io "Your following leave application has been approved"')[0];
  var message = threads.getMessages()[0]; // Get first message

  // Get leave type
  var leaveType = message.getPlainBody().match(/(?<=\bLeave Type\s)(.*)/)[0]

  // Get leave start and end date
  var leaveDate = message.getPlainBody().match(/(?<=\bLeave Date\s)(.*)/)[0]
  var startDate = new Date(leaveDate.split(" - ")[0])
  var endDate = new Date(leaveDate.split(" - ")[1])

  createEvent(leaveType, startDate, endDate)
  
  // // Only create events for unread messages in the GMAIL_LABEL
  // for (var i = 0; i < threads.length; i++) {    
  //   if (threads[i].isUnread()) {
  //     var emailSubject = threads[i].getFirstMessageSubject()
  //     var emailMessage = threads[i].getMessages()[0].getPlainBody()
  //     var [eventTitle, startTime, endTime, isAllDay, optionalParams] = parseEmail(emailSubject, emailMessage)  
  //     createEvent(eventTitle, startTime, endTime, isAllDay, optionalParams) 
  //     threads[i].markRead()
  //   } 
  // }
}

function createEvent(leaveType, startDate, endDate){
  var calPayload
  var eventTitle = `Out of Office - ${leaveType}`
  
  //TO_DO convert date to specific format
  //PENDING outOfOffice API https://issuetracker.google.com/issues/112063903?pli=1

  // For single-day events don't need an end date
  if (startDate.valueOf() === endDate.valueOf()) {
    calPayload = [eventTitle, startDate]  
  } else {
    calPayload = [eventTitle, startDate, endDate]
  }
  
  var event = CalendarApp.getDefaultCalendar().createAllDayEvent(...calPayload)

  // if (isAllDay) {
  //   var event = CalendarApp.getDefaultCalendar().createAllDayEvent(...calPayload)
  // } else {
  //   var event = CalendarApp.getDefaultCalendar().createEvent(...calPayload)
  // }
  Logger.log('Event Added: ' + eventTitle + ', ' + startDate + '(ID: ' + event.getId() + ')');
}

