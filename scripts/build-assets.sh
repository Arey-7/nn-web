#!/usr/bin/env bash
#
# Generates web derivatives from the originals in public/ads into public/w.
# Idempotent: existing outputs are skipped, so reruns are cheap and adding a
# single new campaign does not re-encode the whole library.
#
#   npm run assets            # build everything missing
#   FORCE=1 npm run assets    # rebuild from scratch
#
# Requires ffmpeg and sips (macOS).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/public/ads"
OUT="$ROOT/public/w"

PRINT_MAX=1800   # long edge of the full-size web image
THUMB_MAX=700    # long edge of the grid thumbnail
MOSAIC_MAX=360   # long edge of the hero mosaic tile
FILM_W=960       # film is SD-mastered; never upscale past this
LOOP_W=768
LOOP_SECS=6

mkdir -p "$OUT/print" "$OUT/film" "$OUT/radio"

skip() { [[ -z "${FORCE:-}" && -f "$1" ]]; }

# Long edge of an image, via sips.
long_edge() {
  local w h
  w=$(sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$1" | awk '/pixelHeight/{print $2}')
  echo $(( w > h ? w : h ))
}

# resize <src> <dest> <max-long-edge> <quality>
# Only ever downscales. Several originals (the AWF set is ~630px) are smaller
# than the target and must not be blown up.
resize() {
  local src="$1" dest="$2" max="$3" q="$4"
  if [[ "$(long_edge "$src")" -gt "$max" ]]; then
    sips -Z "$max" -s format jpeg -s formatOptions "$q" "$src" --out "$dest" >/dev/null
  else
    sips -s format jpeg -s formatOptions "$q" "$src" --out "$dest" >/dev/null
  fi
}

print_asset() {
  local src="$SRC/print/$1" slug="$2"
  [[ -f "$src" ]] || { echo "  !! missing $src"; return; }
  if ! skip "$OUT/print/$slug.jpg"; then
    resize "$src" "$OUT/print/$slug.jpg" "$PRINT_MAX" 80
  fi
  if ! skip "$OUT/print/$slug-t.jpg"; then
    resize "$src" "$OUT/print/$slug-t.jpg" "$THUMB_MAX" 72
  fi
  if ! skip "$OUT/print/$slug-s.jpg"; then
    resize "$src" "$OUT/print/$slug-s.jpg" "$MOSAIC_MAX" 66
  fi
  echo "  print  $slug"
}

film_asset() {
  local src="$SRC/video/$1" slug="$2" crf="${3:-23}"
  [[ -f "$src" ]] || { echo "  !! missing $src"; return; }

  # Sample a quarter of the way in — far enough past titles and fades to land
  # on a frame that actually represents the film.
  local dur mark
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  mark=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d*0.25}')

  if ! skip "$OUT/film/$slug-poster.jpg"; then
    ffmpeg -nostdin -v error -ss "$mark" -i "$src" -frames:v 1 \
      -vf "scale='min($FILM_W,iw)':-2" -q:v 3 "$OUT/film/$slug-poster.jpg" -y
  fi

  if ! skip "$OUT/film/$slug-loop.mp4"; then
    ffmpeg -nostdin -v error -ss "$mark" -t "$LOOP_SECS" -i "$src" -an \
      -vf "scale='min($LOOP_W,iw)':-2" -c:v libx264 -crf 30 -preset medium \
      -pix_fmt yuv420p -movflags +faststart "$OUT/film/$slug-loop.mp4" -y
  fi

  if ! skip "$OUT/film/$slug.mp4"; then
    ffmpeg -nostdin -v error -i "$src" \
      -vf "scale='min($FILM_W,iw)':-2" -c:v libx264 -crf "$crf" -preset medium \
      -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart \
      "$OUT/film/$slug.mp4" -y
  fi
  echo "  film   $slug"
}

radio_asset() {
  local src="$SRC/radio/$1" slug="$2"
  [[ -f "$src" ]] || { echo "  !! missing $src"; return; }
  if ! skip "$OUT/radio/$slug.mp3"; then
    ffmpeg -nostdin -v error -i "$src" -c:a libmp3lame -b:a 128k \
      "$OUT/radio/$slug.mp3" -y
  fi
  echo "  radio  $slug"
}

echo "==> print"
print_asset "awf/awf_1a.jpg"                          awf-elephant
print_asset "awf/awf_2a.jpg"                          awf-gorilla
print_asset "awf/awf_3a.jpg"                          awf-rhino

print_asset "chiromo_lane/cl.jpg"                     chiromo-mental-case
print_asset "chiromo_lane/cl_2.jpg"                   chiromo-family-curse
print_asset "chiromo_lane/cl_4.jpg"                   chiromo-third
print_asset "chiromo_lane/cl_1.jpg"                   chiromo-wide-1
print_asset "chiromo_lane/cl_3.jpg"                   chiromo-wide-2

print_asset "kenya_human_rights_commision/hanged.jpg" khrc-hanged

for n in 1 2 3 4 5 6 7; do
  print_asset "kra/layout$n.jpg"                      "kra-$n"
done

print_asset "nmg/Mzee is dead.jpg"                    nmg-mzee
print_asset "nmg/Kizza-Besigye.jpg"                   nmg-besigye
print_asset "nmg/@60yrs Wangari Maathai Ads-01.jpg"   nmg-wangari
print_asset "nmg/_SabaSaba.png"                       nmg-sabasaba
print_asset "nmg/_Independence copy.png"              nmg-independence
print_asset "nmg/Albino.png"                          nmg-albino
print_asset "nmg/Female-Tz-president.png"             nmg-tz-president
print_asset "nmg/Royal_wedding.png"                   nmg-royal-wedding
print_asset "nmg/Equator sounds r_Full page-01.jpg"   nmg-equator

print_asset "peugoet/p.jpg"                           peugeot-3008
print_asset "peugoet/p_1.png"                         peugeot-2
print_asset "peugoet/p_2.png"                         peugeot-3
print_asset "peugoet/p_3.png"                         peugeot-4
print_asset "peugoet/p_4.png"                         peugeot-5

echo "==> film"
film_asset "bd/The Next Big Thing - Powered by Business Daily.mp4" bd-next-big-thing
film_asset "bic/BIC 60secs Without Newspaper.mp4"                  bic-without-newspaper
# Where a film exists as both a 60s cut and a 3min cut, only the 60s is used —
# it is the broadcast piece. Bake & Bite and Pathology have no short cut, so
# they ship long at a gentler CRF to keep the lightbox download reasonable.
film_asset "cfc_stanbic_bank/Stanbic_Babuh_Freighters_080516_60secs.mp4"   stanbic-babuh-60
film_asset "cfc_stanbic_bank/Stanbic_GIBB_AFRICA_60secs_170516_Amends.mp4" stanbic-gibb-60
film_asset "cfc_stanbic_bank/Stanbic_Kaitet_Farm_070516_60secs.mp4"        stanbic-kaitet-60
film_asset "cfc_stanbic_bank/CfC_Stanbic_Bake_&_Bite_3mins_170416_amends.mp4" stanbic-bake-and-bite 27
film_asset "cfc_stanbic_bank/Stanbic_Pathology_3mins_170416_Amends.mp4"       stanbic-pathology 27
film_asset "lucozade/Lucozade Kenya.mp4"                           lucozade-kenya
film_asset "p_s_kenya/Mbu fake 64s.mp4"                            psi-mbu-64
film_asset "the_east_african/The_East_African_Newspaper_TVC_taxi.mp4" tea-taxi

echo "==> radio"
radio_asset "celtel/celtel beijing.mp3"     celtel-beijing
radio_asset "celtel/celtel london.mp3"      celtel-london
radio_asset "hedex/Hedex 3in1 Mix 12.mp3"   hedex-3in1
radio_asset "kra/KRA - pattni.mp3"          kra-pattni
radio_asset "moe/MOE wind.mp3"              moe-wind

echo
echo "done. output size:"
du -sh "$OUT"/*
