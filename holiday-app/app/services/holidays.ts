export type Holiday = {
  name: string;
  startdate: string; // YYYY-MM-DD
  enddate: string;   // YYYY-MM-DD
};

export async function fetchHolidays(schoolYear: string, region: string): Promise<Holiday[]> {
  try {
    const url = `https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/${schoolYear}?output=json`;
    const response = await fetch(url);
    const json = await response.json();

    const vacationTypes = ['Herfstvakantie', 'Kerstvakantie', 'Voorjaarsvakantie'];
    const vacations = json?.content?.[0]?.vacations || [];
    const holidays: Holiday[] = [];

    for (const vacation of vacations) {
      const type = (vacation?.type || '').trim();
      if (!vacationTypes.includes(type)) continue;

      for (const reg of vacation?.regions || []) {
        const regionName = (reg?.region || '').trim().toLowerCase();

        const isRegionMatch =
          regionName === region.toLowerCase() ||
          (type === 'Kerstvakantie' && regionName === 'heel nederland');

        if (isRegionMatch) {
          holidays.push({
            name: type,
            startdate: (reg?.startdate || '').slice(0, 10),
            enddate: (reg?.enddate || '').slice(0, 10),
          });
        }
      }
    }

    holidays.sort((a, b) => new Date(a.startdate).getTime() - new Date(b.startdate).getTime());
    return holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}
