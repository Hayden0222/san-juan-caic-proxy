export default async function handler(req, res) {
  const { zone = 'all', data_type = 'forecast', date } = req.query;

  try {
    const response = await fetch("https://avalanche.state.co.us/api-proxy/forecasts/full");
    const data = await response.json();

    const zones = {
      north: "North San Juan",
      south: "South San Juan",
    };

    const filtered = data.filter(entry => {
      if (zone === "all") return entry.zone.includes("San Juan");
      return entry.zone === zones[zone];
    });

    const result = filtered.map(entry => {
      const out = { zone: entry.zone, date: entry.dateIssued };

      if (data_type.includes("forecast")) out.forecast = entry;
      if (data_type.includes("observations")) out.observations = entry.observations || [];
      if (data_type.includes("weather")) out.weather = entry.weatherSummary || '';
      if (data_type.includes("snowpack")) out.snowpack = entry.snowpackSummary || '';

      return out;
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch CAIC data" });
  }
}
