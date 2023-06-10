import { CreateTicketDto } from '../support/dto/create-ticket.dto';

const date = new Date();
date.setDate(date.getDate() + 1);

const tomorrow = date.toDateString();

export function emptyWeekHtml(userName: string, week: number) {
  const content = `<h3>Hi ${userName}!</h3>\n  Our records indicate you haven't made a pick this week for\n
    \t\t<i>The MLB Survivor Game!</i>  \nMake sure to get it in for week ${week} before first pitch tomorrow, ${tomorrow}!  If you believe you have
    received this email in error, <a href="mailto:layrfive_mlbsgv2@hotmail.com">please send us a message!</a>
    `;
  return content;
}

export function emptyWeekText(userName: string, week: number) {
  const content = `Hi ${userName}!\n  Our records indicate you haven't made a pick this week for\n
    \t\tThe MLB Survivor Game! <br>Make sure to get it in for week ${week} before first pitch tomorrow, ${tomorrow}!  <br>If you believe you have
    received this email in error, you can ignore this email!
    `;
  return content;
}

export function userStatusHtml(
  username: string,
  week: number,
  diff: number,
  pick: string,
) {
  let content: string;
  if (diff > 0) {
    content = `<h3>Hi ${username}!</h3>\n Your pick for week ${week}, the <i>${pick}</i>\n
    posted a run differential of <h5>${diff}</h5>  Meaning you ADVANCE to week ${
      week + 1
    }\n
    Congratulations!
    `;
  } else if (diff <= 0) {
    content = `<h3>Hi ${username}!</h3>\n Your pick for week ${week}, the <i>${pick}</i>\n
    posted a run differential of <h5>${diff}</h5>  Unfortunately, this means you are eliminated from this run!\n
    We want to thank you so much for playing, and stay tuned for the next run!`;
  }
  return content;
}

export function userStatusText(
  username: string,
  week: number,
  diff: number,
  pick: string,
) {
  let content: string;
  if (diff > 0) {
    content = `Hi ${username}!\n Your pick for week ${week}, the \n\t${pick}\n posted a 
    run differential of ${diff}!  Meaning you ADVANCE to week ${
      week + 1
    }!  Congratulations!`;
  } else if (diff >= 0) {
    content = `Hi ${username}!\n Your pick for week ${week}, the \n\t${pick}\n posted a
    run differential of ${diff}!  Unfortunately, this means you are eliinated from this run of the MLBSG.  
    We want to thank you so much for playing, and stay tuned for the next run!`;
  }
  return content;
}

export function supportTicketHtml(createTicketDto: CreateTicketDto) {
  const { username, email, ticket_body, issue_type } = createTicketDto;
  const content = `
  User <h3>${email}</h3> is reporting an issue regarding <h3>${issue_type}</h3>:\n
    \t<i>${ticket_body}</i>\n
    \tActive user name (if any) is: <h3>${username}</h3>
  `;
  return content;
}

export function supportTicketText(createTicketDto: CreateTicketDto) {
  const { username, email, ticket_body, issue_type } = createTicketDto;
  const content = `
    User ${email} reporting issue regarding ${issue_type}:\n
  \t${ticket_body}\n
    \t\tActive username is: ${username}
    `;
  return content;
}
