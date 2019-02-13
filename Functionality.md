# Functionality

## Events

### When page loads

- Put 16 images in random spots in the 16 boxes

### When play button is clicked

- Start time elapsed timer
- Turn play button to restart button

### When restart button is clicked

- Shuffle images
- restart time elapsed
- restart moves

### When a box gets clicked

- Reveal image
- Increase move count by 1
- Check to see if in current round
  - If in current round, check to see if image matches previously selected box match
    - If Images match, mark boxes completed, create correct animation, check to see if all boxes are completed
      - If all boxes are completed, game completed! stop time elapsed timer, save time (local storage maybe)
      - If all boxes not completed, game continues
    - If images don't match , create incorrect animation, hide images, game continues
  - if not in current round, mark in current round, save box data as selected box - wait until the next box is clicked

### When leaderboard is clicked

- flip game board and show leaderboard - possibly best time stored in local storage
