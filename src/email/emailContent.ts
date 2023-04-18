export const htmlContent = (userName, week) => {
  `<h3>Hi ${userName}!</h3>\n  Our records indicate you haven't made a pick this week for\n
    \t\t<i>The MLB Survivor Game!</i>  \nMake sure to get it in for week ${week} before the deadline!  If you believe you have
    received this email in error, <a href="mailto:layrfive_mlbsgv2@hotmail.com">please send us a message!</a>
    `;
};

export const textContent = (userName, week) => {
  `Hi ${userName}!\n  Our records indicate you haven't made a pick this week for\n
    \t\tThe MLB Survivor Game! <br>Make sure to get it in for week ${week} before the deadline!  <br>If you believe you have
    received this email in error, you can ignore this email!
    `;
};
