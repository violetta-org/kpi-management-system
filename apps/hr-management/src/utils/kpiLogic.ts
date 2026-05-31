export const calculateKpiAchievementRate = (
  targetValue: number,
  actualValue: number,
  direction?: number
): number => {
  if (targetValue === 0 && actualValue === 0) return 100;
  
  const dir = direction ?? 1; // Default to Higher is better (1)

  // 2: Lower is Better (Tối thiểu hóa)
  if (dir === 2) {
    if (actualValue <= targetValue) {
      return 100;
    }
    if (targetValue <= 0) {
      return 0; // Target was <= 0 and actual is > target (failed)
    }
    return Math.max(0, Math.round((2 - actualValue / targetValue) * 100));
  }

  // 3: Binary (Đạt / Không đạt), 4: Milestone (Cột mốc)
  if (dir === 3 || dir === 4) {
    return actualValue >= targetValue ? 100 : 0;
  }

  // 1: Higher is Better (Tối đa hóa - Default)
  if (targetValue <= 0) {
    return actualValue >= targetValue ? 100 : 0;
  }
  return Math.round((actualValue / targetValue) * 100);
};
