export const setMenu = (data: any) => {
  let menu = data.map((m: any) => {
    // let parts = m.Component.split('/');
    // console.log(parts)
    // let englishOnly = m.Name.replace(/[^a-zA-Z]/g, '');
    // console.log(englishOnly);
    return {
      ID: m.ID,
      FID: m.FID,
      MenuLevel: m.Level,
      MenuName: m.Name,
      title: m.Desc,
      path: m.Name,
      component: m.Component,
      EquipmentDesc: m.EquipmentDesc,
      EquipmentName: m.EquipmentName,
      sortId: m.sortId,
    };
  });
  let arr = OrganData(menu);
  return arr;
};

export const OrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.ID, { ...org, childMenu: [] });
  });
  organizations.forEach((org: any) => {
    if (org.FID !== null) {
      const parentOrg = organizationMap.get(org.FID);
      if (parentOrg) {
        parentOrg.childMenu.push(organizationMap.get(org.ID));
      }
    }
  });
  return Array.from(organizationMap.values()).filter((org) => org.FID === null);
};

// export const shortcuts = [
//   {
//     text: "近三个月",
//     value: () => {
//       const end = new Date();
//       let start = new Date(end);
//       let targetMonth = end.getMonth() - 3;
//       let targetYear = end.getFullYear();
//       // 处理跨年情况
//       if (targetMonth < 0) {
//         targetMonth += 12;
//         targetYear -= 1;
//       }
//       start.setFullYear(targetYear);
//       start.setMonth(targetMonth);
//       // start.setDate(1); // 确保是月份的第一天
//       return [start, end];
//     },
//   },
//   {
//     text: "本月",
//     value: () => {
//       const end = new Date();
//       const start = new Date();
//       const date = new Date().getDate() - 1;
//       start.setTime(start.getTime() - 3600 * 1000 * 24 * date);
//       return [start, end];
//     },
//   },
//   {
//     text: "近七天",
//     value: () => {
//       const end = new Date();
//       const start = new Date();
//       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//       return [start, end];
//     },
//   },
//   {
//     text: "当天",
//     value: () => {
//       const end = new Date();
//       const start = new Date();
//       return [start, end];
//     },
//   },
// ];
export const shortcuts = [
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999); // 结束时间为当天结束

      const start = new Date();
      let targetMonth = start.getMonth() - 3;
      let targetYear = start.getFullYear();
      // 处理跨年情况
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      start.setFullYear(targetYear);
      start.setMonth(targetMonth);
      // 注意：如果当前日期（如31日）在目标月份中不存在，JS会自动调整到下个月
      // 设置起始时间为当天开始
      start.setHours(0, 0, 0, 0);

      return [start, end];
    },
  },
  {
    text: "本月",
    value: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999); // 结束时间为当天结束

      const start = new Date();
      start.setDate(1); // 设置为本月第一天
      start.setHours(0, 0, 0, 0); // 起始时间为当天开始

      return [start, end];
    },
  },
  {
    text: "近七天",
    value: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999); // 结束时间为当天结束

      const start = new Date();
      start.setDate(start.getDate() - 6); // 设置为7天前
      start.setHours(0, 0, 0, 0); // 起始时间为当天开始

      return [start, end];
    },
  },
  {
    text: "当天",
    value: () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0); // 起始时间为当天开始

      const end = new Date();
      end.setHours(23, 59, 59, 999); // 结束时间为当天结束

      return [start, end];
    },
  },
];
export const setTodayDate = (isSecond?: boolean) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  if (isSecond) {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  return `${year}-${month}-${day}`;
};

export const setLastDate = (isSecond?: boolean) => {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  
  if (isSecond) {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  return `${year}-${month}-${day}`;
};
//限制三个月的选择
export const disabledDate = (time: Date) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 今天的开始时间

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayStart.getDate() + 1); // 今天的结束时间（下一天的开始时间，但不包括那一天）
  todayEnd.setMilliseconds(-1); // 为了确保今天的最后一毫秒也是可选的

  const threeMonthsAgo = new Date(todayStart);
  threeMonthsAgo.setMonth(todayStart.getMonth() - 3);

  // 禁用三个月之前的日期和今天之后的日期
  return (
    time.getTime() < threeMonthsAgo.getTime() ||
    time.getTime() >= todayEnd.getTime()
  );
};

export const getLastDayOfMonth = (year: any, month: any) => {
  // JavaScript的Date对象月份是从0开始的，所以我们需要减1
  const date = new Date(year, month, 0);
  // date对象现在表示的是下一个月的第一天，但我们想要的是当前月的最后一天
  return date.getDate();
};

export const parseDateString = (dateStr: any) => {
  dateStr = dateStr.trim();

  // 定义日期格式化函数
  const formatDate = (year: any, month: string, day: string) => {
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // 正则表达式匹配不同的日期格式
  const singleDateRegex = /(\d{4})年(\d{1,2})月(\d{1,2})日$/;
  const monthRangeRegex = /(\d{4})年(\d{1,2})月$/;
  const dateRangeRegex =
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*–\s*(\d{4})年(\d{1,2})月(\d{1,2})日$/;
  const shortDateRangeRegex =
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*–\s*(\d{1,2})日$/;
  const monthDayRangeRegex =
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*–\s*(\d{1,2})月(\d{1,2})日$/;

  let startDate, endDate;

  if (singleDateRegex.test(dateStr)) {
    // 格式: 2024年12月29日
    const [, year, month, day] = dateStr.match(singleDateRegex);
    startDate = endDate = formatDate(year, month, day);
  } else if (monthRangeRegex.test(dateStr)) {
    // 格式: 2024年12月
    const [, year, month] = dateStr.match(monthRangeRegex);
    startDate = formatDate(year, month, "01");
    endDate = formatDate(
      year,
      month,
      new Date(year, month, 0).getDate().toString()
    );
  } else if (dateRangeRegex.test(dateStr)) {
    // 格式: 2024年12月29日 – 2025年1月4日
    const [, startYear, startMonth, startDay, endYear, endMonth, endDay] =
      dateStr.match(dateRangeRegex);
    startDate = formatDate(startYear, startMonth, startDay);
    endDate = formatDate(endYear, endMonth, endDay);
  } else if (shortDateRangeRegex.test(dateStr)) {
    // 格式: 2025年1月12日 – 18日
    const [, startYear, startMonth, startDay, endDay] =
      dateStr.match(shortDateRangeRegex);
    startDate = formatDate(startYear, startMonth, startDay);
    endDate = formatDate(startYear, startMonth, endDay);
  } else if (monthDayRangeRegex.test(dateStr)) {
    // 格式: 2025年1月27日 – 2月2日
    const [, startYear, startMonth, startDay, endMonth, endDay] =
      dateStr.match(monthDayRangeRegex);
    startDate = formatDate(startYear, startMonth, startDay);
    endDate = formatDate(startYear, endMonth, endDay);
  } else {
    throw new Error("日期格式不支持");
  }

  return [startDate, endDate];
};
