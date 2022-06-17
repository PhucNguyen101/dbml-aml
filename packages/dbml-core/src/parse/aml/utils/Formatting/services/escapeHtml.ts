const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// escape by replacing with HTML entity chars
// should not use DOM textContent or innerHTML due to injection vulnerabilities
//
// reference
// http://stackoverflow.com/questions/14462612/escape-html-text-in-an-angularjs-directive#28537958
export default (html):string => {
  // expect string or number input, but just in case
  if (html === null || html === undefined || html === {} || html === []) {
    return '';
  }
  return String(html).replace(/[&<>"']/g, (s) => {
    return HTML_ENTITIES[s];
  });
};
