export const returnCorrectImage = (mainText, width) => {
  if (width > 1735) {
    return mainText + '.png';
  } else if (width > 1550) {
    return mainText + '-bb.png';
  } else if (width > 1350) {
    return mainText + '-bm.png';
  } else if (width > 1260) {
    return mainText + '-bs.png';
  } else if (width > 1060) {
    return mainText + '-bxs.png';
  } else if (width > 850) {
    return mainText + '-bxss.png';
  } else if (width > 700) {
    return mainText + '-b.png';
  } else if (width > 525) {
    return mainText + '-sm.png';
  } else if (width > 375) {
    return mainText + '-s.png';
  } else {
    return mainText + '-ss.png';
  }
};
