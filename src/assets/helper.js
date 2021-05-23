const moment = require('moment-jalaali');
const _ = require('lodash');
const apiServer = process.env.API_URL
const markdown = require("markdown").markdown;

export default {
  apiServer,
  nl2br(str, is_xhtml = true) {
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  },
  faToEn(str) {
    let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    if (typeof str === 'string') {
      for (let i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  },
  markdown(md_content, is_xhtml = true) {
    md_content = markdown.toHTML(md_content)
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display
    return (md_content + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  },
  camelCase(str) {
    return (str.slice(0, 1).toLowerCase() + str.slice(1))
      .replace(/([-_ ]){1,}/g, ' ')
      .split(/[-_ ]/)
      .reduce((cur, acc) => {
        return cur + acc[0].toUpperCase() + acc.substring(1);
      });
  },
  pascalCase(str) {
    return (str.slice(0, 1).toUpperCase() + str.slice(1))
      .replace(/([-_ ]){1,}/g, ' ')
      .split(/[-_ ]/)
      .reduce((cur, acc) => {
        return cur + acc[0].toUpperCase() + acc.substring(1);
      });
  },
  sepCase(str, sep = '-') {
    return str
      .replace(/[A-Z]/g, (letter, index) => {
        const lcLet = letter.toLowerCase();
        return index ? sep + lcLet : lcLet;
      })
      .replace(/([-_ ]){1,}/g, sep)
  },
  combineDateTime(date, time = '00:00:00') {
    return moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DDTHH:mm:ss") + "Z";
  },
  getTime(datetime) {
    return moment.utc(datetime, 'YYYY-MM-DDTHH:mm:ssZ').format("HH:mm");
  },
  getDate(datetime) {
    return moment(datetime, 'YYYY-MM-DDTHH:mm:ssZ').format("YYYY-MM-DD");
  },
  timeDiff(time) {
    let duration = moment.duration(Date.now() - new Date(time).getTime());
    return duration.asHours();
  },
  goToPay(amount, type = 'charge') {
    return '/payment/pay?amount=' + amount + '&type=' + type;
  },
  toJalaali(date, toFormat = 'jYYYY/jM/jD h:mm') {
    var m = moment(date, 'YYYY/M/D h:mm');
    return date ? m.format(toFormat) : date;
  },
  getPersianMask() {
    return [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g, /٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  },
  numberFormat(num) {
    return (num && num % 1 === 0) ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : num
  },
  price(num, unit = 'ریال') {
    return num ? num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + unit : 0
  },
  showError(error, $swal, $router = null) {
    $swal({
      title: 'خطا',
      text: error
    })
    if (_.get(error, 'response.status', 200) == 401 || error.message == 'Invalid token.') {
      $router.push('/admin/auth')
    }
  },
  showSuccess(res, $swal, $router = null) {
    $swal({
      title: 'انجام شد',
      type: 'success',
      text: _.get(res, 'statusText', 'با موفقیت انجام شد')
    })
    if (_.get(res, 'response.status', 200) == 401 || res.message == 'Invalid token.') {
      $router.push('/admin/auth')
    }
  },
  range: (x, y) => Array.from(function* () {
    while (x <= y) yield x++;
  }()),
  removeNulls(obj) {
    var isArray = obj instanceof Array;
    for (var k in obj) {
      if (obj[k] === null) isArray ? obj.splice(k, 1) : delete obj[k];
      else if (typeof obj[k] == "object") removeNulls(obj[k]);
      if (isArray && obj.length == k) removeNulls(obj);
    }
    return obj;
  },
  pickDeep(collection, predicate, thisArg) {
    if (_.isFunction(predicate)) {
      predicate = _.createCallback(predicate, thisArg);
    } else {
      var keys = _.flatten(_.rest(arguments));
      predicate = function (val, key) {
        return _.contains(keys, key);
      }
    }

    return _.transform(collection, function (memo, val, key) {
      var include = predicate(val, key);
      if (!include && _.isObject(val)) {
        val = this.pickDeep(val, predicate);
        include = !_.isEmpty(val);
      }
      if (include) {
        _.isArray(collection) ? memo.push(val) : memo[key] = val;
      }
    });
  }, setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }, getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }, eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }

}
