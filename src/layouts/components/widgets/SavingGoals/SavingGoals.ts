import "./Goal.css";

export interface GoalData {
  title: string;
  category: string;
  currentAmount: string;
  targetAmount: string;
  percentage: number;
  timeLeft: string;
}

/**
 * Returns the icon path based on the savings goal category.
 */
function getCategoryIcon(category: string): string {
  const normalizedCategory = category
    .toLowerCase()
    .trim();

  const icons: Record<string, string> = {
    emergency: "/src/assets/icons/emergency-icon.svg",
    "long term": "/src/assets/icons/long-term-icon.svg",
    "short term": "/src/assets/icons/short-term-icon.svg",
    "major purchase": "/src/assets/icons/major-purchase-icon.svg",
    travel: "/src/assets/icons/travel-icon.svg",
    education: "/src/assets/icons/education-icon.svg",
    home: "/src/assets/icons/home-icon.svg",
    car: "/src/assets/icons/car-icon.svg",
    health: "/src/assets/icons/health-icon.svg",
    investment: "/src/assets/icons/investment-icon.svg",
    leisure: "/src/assets/icons/leisure-icon.svg",
    family: "/src/assets/icons/family-icon.svg",
    business: "/src/assets/icons/business-icon.svg",
    other: "/src/assets/icons/other-icon.svg",
  };

  return icons[normalizedCategory] || "/src/assets/icons/other-icon.svg";
}

/**
 * Generates a random bright HSL color along with opacity variants.
 */
function getRandomBrightTheme() {
  const hue = Math.floor(Math.random() * 360);
  const saturation =
    Math.floor(Math.random() * 20) + 80;
  const lightness =
    Math.floor(Math.random() * 15) + 50;

  return {
    solid: `hsl(${hue} ${saturation}% ${lightness}%)`,
    transparentBg: `hsl(${hue} ${saturation}% ${lightness}% / 0.3)`,
  };
}

/**
 * Creates a colored SVG mask icon.
 */
function createMaskIcon(
  src: string,
  width: number,
  height: number,
  color: string
): HTMLDivElement {
  const icon = document.createElement("div");

  icon.className = "item-icon-mask";

  icon.style.width = `${width}px`;
  icon.style.height = `${height}px`;
  icon.style.backgroundColor = color;

  icon.style.webkitMask =
    `url("${src}") no-repeat center / contain`;

  icon.style.mask =
    `url("${src}") no-repeat center / contain`;

  return icon;
}

export function addGoal(
  data: GoalData
): HTMLDivElement {
  const theme = getRandomBrightTheme();

  // --------------------------------
  // Top icon — based on category
  // --------------------------------

  const categoryIcon = getCategoryIcon(
    data.category
  );

  // Outer container
  const widget = document.createElement("div");
  widget.className = "widget";

  // --- Title Row ---
  const titleRow = document.createElement("div");
  titleRow.className = "title-row";

  const goalIconBox = document.createElement("div");
  goalIconBox.className = "goal-icon";

  goalIconBox.style.backgroundColor =
    theme.transparentBg;

  const mainIcon = createMaskIcon(
    categoryIcon,
    24,
    24,
    theme.solid
  );

  goalIconBox.appendChild(mainIcon);

  // --- Title ---
  const titleColumn = document.createElement("div");
  titleColumn.className = "title-column";

  const goalTitle = document.createElement("h1");
  goalTitle.className = "goal-title";
  goalTitle.textContent = data.title;

  // --- Category ---
  const categoryBox = document.createElement("div");
  categoryBox.className = "category-box";

  const category = document.createElement("span");
  category.className = "category";
  category.textContent =
    data.category.toUpperCase();

  categoryBox.appendChild(category);

  titleColumn.appendChild(goalTitle);
  titleColumn.appendChild(categoryBox);

  titleRow.appendChild(goalIconBox);
  titleRow.appendChild(titleColumn);

  // --------------------------------
  // Money Row
  // --------------------------------

  const moneyRow = document.createElement("div");
  moneyRow.className = "money-row";

  const currentAmount = document.createElement("h3");
  currentAmount.className = "current-amount";
  currentAmount.textContent =
    data.currentAmount;

  const goalAmount = document.createElement("span");
  goalAmount.className = "goal-amount";
  goalAmount.textContent =
    `of ${data.targetAmount}`;

  moneyRow.appendChild(currentAmount);
  moneyRow.appendChild(goalAmount);

  // --------------------------------
  // Progress Bar
  // --------------------------------

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const currentProgress =
    document.createElement("div");

  currentProgress.className =
    "current-progress";

  currentProgress.style.width =
    `${Math.min(
      100,
      Math.max(0, data.percentage)
    )}%`;

  currentProgress.style.backgroundColor =
    theme.solid;

  progressBar.appendChild(currentProgress);

  // --------------------------------
  // Deadline Row
  // --------------------------------

  const deadlineRow = document.createElement("div");
  deadlineRow.className = "deadline-row";

  const deadlineBox = document.createElement("div");
  deadlineBox.className = "deadline-box";

  // Always use the calendar icon here
  const deadlineIcon =
    document.createElement("img");

  deadlineIcon.src =
    "/src/assets/icons/calendar-icon.svg";

  deadlineIcon.alt = "Calendar";
  deadlineIcon.className = "item-icon";
  deadlineIcon.width = 16;
  deadlineIcon.height = 16;

  const timeLeft = document.createElement("span");
  timeLeft.className = "time-left";
  timeLeft.textContent = data.timeLeft;

  deadlineBox.appendChild(deadlineIcon);
  deadlineBox.appendChild(timeLeft);

  // --------------------------------
  // Percentage
  // --------------------------------

  const goalPercentage =
    document.createElement("span");

  goalPercentage.className =
    "goal-percentage";

  goalPercentage.style.color =
    theme.solid;

  goalPercentage.textContent =
    `${data.percentage}%`;

  deadlineRow.appendChild(deadlineBox);
  deadlineRow.appendChild(goalPercentage);

  // --------------------------------
  // Assemble widget
  // --------------------------------

  widget.appendChild(titleRow);
  widget.appendChild(moneyRow);
  widget.appendChild(progressBar);
  widget.appendChild(deadlineRow);

  return widget;
}