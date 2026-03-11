// ==================== Supabase Client ====================
var SUPABASE_URL = "https://wxwjsyhrykiexkkoyhoz.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2pzeWhyeWtpZXhra295aG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjEwNDcsImV4cCI6MjA4ODczNzA0N30.53Ww3hcMl6xirqELFvgZGe-k_Oxfjx6xyAaEAkcOjJ4";
var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== DB ↔ JS mapping ====================
function dbToTrip(row) {
  return {
    id: row.id,
    carrierId: row.carrier_id,
    carrier: row.carrier,
    fromKey: row.from_key,
    toKey: row.to_key,
    date: row.trip_date,
    departure: row.departure,
    arrival: row.arrival,
    duration: row.duration,
    price: row.price,
    seats: row.seats,
    totalSeats: row.total_seats || row.seats || 20,
    parcels: row.parcels,
    pickupLat: row.pickup_lat,
    pickupLng: row.pickup_lng,
    phone: row.phone,
    waypoints: row.waypoints || [],
    wifi: row.wifi || false,
    powerOutlets: row.power_outlets || false,
    ac: row.ac || false,
    toilet: row.toilet || false,
    luggage: row.luggage || false,
    pets: row.pets || false,
    logoUrl: row.logo_url || ""
  };
}

function tripToDb(trip) {
  var obj = {
    carrier_id: trip.carrierId,
    carrier: trip.carrier,
    from_key: trip.fromKey,
    to_key: trip.toKey,
    trip_date: trip.date,
    departure: trip.departure,
    arrival: trip.arrival,
    duration: trip.duration,
    price: trip.price,
    seats: trip.seats,
    total_seats: trip.totalSeats || trip.seats || 20,
    parcels: trip.parcels,
    pickup_lat: trip.pickupLat,
    pickup_lng: trip.pickupLng,
    phone: trip.phone,
    waypoints: trip.waypoints || [],
    wifi: trip.wifi || false,
    power_outlets: trip.powerOutlets || false,
    ac: trip.ac || false,
    toilet: trip.toilet || false,
    luggage: trip.luggage || false,
    pets: trip.pets || false,
    logo_url: trip.logoUrl || ""
  };
  if (trip.id) obj.id = trip.id;
  return obj;
}

// ==================== CRUD helpers ====================
async function sbLoadTrips() {
  var { data, error } = await sb.from("routes").select("*").order("created_at");
  if (error) { console.error("Supabase load error:", error); return []; }
  return data.map(dbToTrip);
}

async function sbInsertTrip(trip) {
  var { data, error } = await sb.from("routes").insert(tripToDb(trip)).select().single();
  if (error) { console.error("Supabase insert error:", error); return null; }
  return dbToTrip(data);
}

async function sbUpdateTrip(trip) {
  var { data, error } = await sb.from("routes").update(tripToDb(trip)).eq("id", trip.id).select().single();
  if (error) { console.error("Supabase update error:", error); return null; }
  return dbToTrip(data);
}

async function sbDeleteTrip(id) {
  var { error } = await sb.from("routes").delete().eq("id", id);
  if (error) { console.error("Supabase delete error:", error); return false; }
  return true;
}

async function sbLoadBookingCounts() {
  var { data, error } = await sb.from("bookings").select("route_id,seats_count");
  if (error) { console.error("Supabase bookings error:", error); return {}; }
  var map = {};
  (data || []).forEach(function(b) {
    map[b.route_id] = (map[b.route_id] || 0) + b.seats_count;
  });
  return map;
}

async function sbResetToDemo(demoTrips) {
  await sb.from("routes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  var rows = demoTrips.map(function(t) {
    var r = tripToDb(t);
    delete r.id;
    return r;
  });
  var { data, error } = await sb.from("routes").insert(rows).select();
  if (error) { console.error("Supabase reset error:", error); return []; }
  return data.map(dbToTrip);
}
