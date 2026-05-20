#!/usr/bin/env bash
# Quick smoke test for SmileCare tool APIs (run after fixing API key).
set -euo pipefail

BASE="${1:-https://reception-ai-delta.vercel.app}"
KEY="${SMILECARE_TENANT_API_KEY:-stak_51827_fha+sssk}"
AUTH="Authorization: Bearer $KEY"

echo "=== SmileCare API smoke test ==="
echo "Base: $BASE"
echo ""

echo "1. health"
curl -sf -H "$AUTH" "$BASE/api/tools/smilecare/health" | python3 -m json.tool
echo ""

echo "2. list_doctors"
curl -sf -H "$AUTH" "$BASE/api/tools/smilecare/list_doctors" | python3 -m json.tool
echo ""

echo "3. recommend_doctor"
REC=$(curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"symptoms":"tooth pain on the right side","reason":"urgent visit","urgency":"high","patient_type":"adult"}' \
  "$BASE/api/tools/smilecare/recommend_doctor")
echo "$REC" | python3 -m json.tool
DOCTOR_ID=$(echo "$REC" | python3 -c "import sys,json; print(json.load(sys.stdin).get('doctorId',''))")
SERVICE_ID=$(echo "$REC" | python3 -c "import sys,json; print(json.load(sys.stdin).get('suggestedServiceId',''))")
echo ""

echo "4. get_availability (doctor_id=$DOCTOR_ID)"
AVAIL=$(curl -sf -H "$AUTH" "$BASE/api/tools/smilecare/get_availability?doctor_id=$DOCTOR_ID")
echo "$AVAIL" | python3 -m json.tool
echo ""

echo "5. create_appointment_hold (exact slot_id)"
SLOT_ID=$(echo "$AVAIL" | python3 -c "import sys,json; s=json.load(sys.stdin).get('slots',[]); print(s[0]['slot_id'] if s else '')")
if [ -n "$SLOT_ID" ] && [ -n "$SERVICE_ID" ]; then
  curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
    -d "{\"slot_id\":\"$SLOT_ID\",\"service_id\":\"$SERVICE_ID\",\"patient_name\":\"Test Patient\",\"patient_phone\":\"+5491112345678\",\"reason\":\"tooth pain\"}" \
    "$BASE/api/tools/smilecare/create_appointment_hold" | python3 -m json.tool
else
  echo "Skipped — no slot_id"
fi
echo ""

echo "6. create_appointment_hold (human text: Thursday, May 21st at 4:00 PM)"
curl -sf -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"slot_id\":\"Thursday, May 21st at 4:00 PM\",\"doctor_id\":\"$DOCTOR_ID\",\"service_id\":\"svc_urgent\",\"patient_name\":\"juan pablo hernandez\",\"patient_phone\":\"3415079340\",\"reason\":\"tooth pain\"}" \
  "$BASE/api/tools/smilecare/create_appointment_hold" | python3 -m json.tool
echo ""
echo "Done."
