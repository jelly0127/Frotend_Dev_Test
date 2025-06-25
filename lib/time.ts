import dayjs from 'dayjs';
import 'dayjs/locale/en-us'; // 导入中文语言包
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// set language to english
dayjs.locale('en-us');

// load plugins
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export const formatDate = {
  // format to YYYY-MM-DD HH:mm:ss
  format: (date?: string | Date | null) => {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  },

  // format to relative time (e.g. 3 hours ago)
  fromNow: (date?: string | Date | null) => {
    if (!date) return '';
    return dayjs(date).fromNow();
  },

  // format to date (YYYY-MM-DD)
  formatDate: (date?: string | Date | null) => {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD');
  },

  // format to time (HH:mm:ss)
  formatTime: (date?: string | Date | null) => {
    if (!date) return '';
    return dayjs(date).format('HH:mm:ss');
  },

  // custom format
  formatCustom: (date?: string | Date | null, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '';
    return dayjs(date).format(format);
  },

  // check if date is valid
  isValid: (date?: string | Date | null) => {
    if (!date) return false;
    return dayjs(date).isValid();
  },
};
