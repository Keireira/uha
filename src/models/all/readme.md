### Description (LENSES)

This is not exactly filters but rather a LENSES

You can select either:

- Upcoming only (default)
- Past and Upcoming
- Selected period
- Inifinite (You will see all past payments and all upcoming payments splitted by months)

After you picked up a LENS, that LENS will be stored locally in (
  Settings.set(`filter_lens`) +
  Settings.set(`filter_from_date`) +
  Settings.set(`filter_to_date`)
).

You can change `filter_lens` anytime via either settings or direct filters interface in both (list & calendar) views
You can change `filter_from_date` & `filter_to_date` via filters interface only

### Design?

[ Upcoming only ][==]
[ Past & Upcoming ][==]
[ 28 Jan 23 - 28 Dec 25 ][==] OR [ 28 Jan - 28 Dec ][==] (same current year)
[ Infinite ] [==]

[==] is a button to call BottomSheet with filters
[ XXX ] is a picked LENS

Maybe remove that [==] button?
Use horizontal slider instead? // NO
Do not use bottomsheet because more taps = bad? // NO
Tap on active LENS and show BottomSheet with filters?

### Plans for the future

- Add FILTER by CATEGORY
- Add FILTER by SERVICE
- Add FILTER by TENDER
- Add FILTER by CURRENCY
- Add FILTER by LIST

### Conclusions

- Since I will add FILTERS later, I have to have some view to place them all and separate sheet looks good enough,
though I'd prefer more beautiful solution?
