export const hideTabBar = () => {
  const tabBar = document.getElementById("app-tab-bar");
  // const fab = document.getElementById('app-ion-fab');
  if (tabBar !== null) {
    tabBar.style.display = "none";
    // fab.style.display = 'none';
  }
};

export const showTabBar = () => {
  const tabBar = document.getElementById("app-tab-bar");
  // const fab = document.getElementById('app-ion-fab');

  if (tabBar !== null) {
    tabBar.style.display = "flex";
    // fab.style.display = '';
  }
};
