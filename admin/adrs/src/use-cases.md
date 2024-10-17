# use-cases.ts design decision history - Adrian Layer

## Delay functionalities - **REMOVAL**

### Reasoning

1. The more I think about the purpose of a delayed pop up footnote, the less I think it serves any functionality whatsoever. I can't remember the last time I clicked on any type of link or menu item and wanted it to take *longer* to show me what I was looking for.
2. While the chance is relatively small, this could cause issues while debugging should, for whatever reason, or footnotes are popping up slower than we want them to, we have to check whether the delay is causing this or some issue baked into the delay functionality. If the delay functionality didn't exist in this scenario, we would immediately know something is wrong.

### Action

I think it's logical to remove the `activateDelay, dismissDelay, hoverDelay` functionalities. Changelog:

* Removed any delay functionalities and references to it from any files that contain it. Added these files to admin/adrs and provided a pointer to this document as reasoning.
* Changed all `DelayedFootNoteActions` to `FootNoteActions` in `use-cases.ts`
* Also removed `delay` field from `dismiss` and `activate` functions, then subsequently remove each reference to `delay` from each call of these functions

## Hover Functionalities - **REMOVAL**

### Reasoning

1. When using a web page, I feel that the last thing people want to do is mouse over something on accident and accidentally have it cover up something they're reading. Again, if I want to see something in a footnote, I can simply click it, tap it, whatever, and it should show me the information in the footnote without being intrusive.
2. This function also has the added problem when used in conjunction with a bad cocktail of dismiss, hover and multiple footnote functionalities. Imagine a user accidentally mouses over a footnote, only for it to pop up due to `activateOnHover` and cover something they want to see. They move their mouse away, but because you have `dismissOnUnhover` turned off - **which I should also note is the default setting** - the footnote doesn't go away, and continues blocking their view. Instead, all they've done is accidentally passed their mouse over another footnote, and since you have `allowMultiple` on, now they have two footnotes blocking their view. And so on.

I think preventing devs from even having the option to accidentally fall into this pit of venemous combinations would save a lot of people a headache.

Changelog:

* Removed any hover functionalities and references to it from any files that contain it. Added these files to admin/adrs and provided a pointer to this document as reasoning.
* Also removed all hover functionalities from `use-cases.ts`