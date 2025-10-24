const priceTable = [
  { date: 17, breakfast: 40, bsn: 1, lunch: 90, lsn: 2, dinner: 40, dsn: 3 },
  { date: 18, breakfast: 40, bsn: 4, lunch: 90, lsn: 5, dinner: 40, dsn: 6 },
  { date: 19, breakfast: 40, bsn: 7, lunch: 90, lsn: 8, dinner: 40, dsn: 9 },
  { date: 20, breakfast: 40, bsn: 10, lunch: 130, lsn: 11, dinner: 40, dsn: 12 },
  { date: 21, breakfast: 40, bsn: 13, lunch: 130, lsn: 14, dinner: 40, dsn: 15 },
  { date: 22, breakfast: 40, bsn: 16, lunch: 130, lsn: 17, dinner: 40, dsn: 18 },
  { date: 23, breakfast: 40, bsn: 19, lunch: 130, lsn: 20, dinner: 40, dsn: 21 },
  { date: 24, breakfast: 40, bsn: 22, lunch: 130, lsn: 23, dinner: 40, dsn: 24 },
  { date: 25, breakfast: 40, bsn: 25, lunch: 90, lsn: 26, dinner: 40, dsn: 27 },
  { date: 26, breakfast: 40, bsn: 28, lunch: 130, lsn: 29, dinner: 40, dsn: 30 },
  { date: 27, breakfast: 40, bsn: 31, lunch: 130, lsn: 32, dinner: 40, dsn: 33 },
  { date: 28, breakfast: 40, bsn: 34, lunch: 130, lsn: 35, dinner: 40, dsn: 36 },
  { date: 29, breakfast: 40, bsn: 37, lunch: 130, lsn: 38, dinner: 40, dsn: 39 },
  { date: 30, breakfast: 40, bsn: 40, lunch: 130, lsn: 41, dinner: 40, dsn: 42 },
  { date: 31, breakfast: 40, bsn: 43, lunch: 90, lsn: 44, dinner: 40, dsn: 45 },
  { date: 1, breakfast: 40, bsn: 46, lunch: 90, lsn: 47, dinner: 40, dsn: 48 },
  { date: 2, breakfast: 40, bsn: 49, lunch: 90, lsn: 50, dinner: 40, dsn: 51 },
  { date: 3, breakfast: 40, bsn: 52, lunch: 90, lsn: 53, dinner: 40, dsn: 54 },
]

const bsnpricetable = [
  { bsn: 1, price: 40 },
  { bsn: 2, price: 90 },
  { bsn: 3, price: 40 },
  { bsn: 4, price: 40 },
  { bsn: 5, price: 90 },
  { bsn: 6, price: 40 },
  { bsn: 7, price: 40 },
  { bsn: 8, price: 90 },
  { bsn: 9, price: 40 },
  { bsn: 10, price: 40 },
  { bsn: 11, price: 130 },
  { bsn: 12, price: 40 },
  { bsn: 13, price: 40 },
  { bsn: 14, price: 130 },
  { bsn: 15, price: 40 },
  { bsn: 16, price: 40 },
  { bsn: 17, price: 130 },
  { bsn: 18, price: 40 },
  { bsn: 19, price: 40 },
  { bsn: 20, price: 130 },
  { bsn: 21, price: 40 },
  { bsn: 22, price: 40 },
  { bsn: 23, price: 130 },
  { bsn: 24, price: 40 },
  { bsn: 25, price: 40 },
  { bsn: 26, price: 90 },
  { bsn: 27, price: 40 },
  { bsn: 28, price: 40 },
  { bsn: 29, price: 130 },
  { bsn: 30, price: 40 },
  { bsn: 31, price: 40 },
  { bsn: 32, price: 130 },
  { bsn: 33, price: 40 },
  { bsn: 34, price: 40 },
  { bsn: 35, price: 130 },
  { bsn: 36, price: 40 },
  { bsn: 37, price: 40 },
  { bsn: 38, price: 130 },
  { bsn: 39, price: 40 },
  { bsn: 40, price: 40 },
  { bsn: 41, price: 130 },
  { bsn: 42, price: 40 },
  { bsn: 43, price: 40 },
  { bsn: 44, price: 90 },
  { bsn: 45, price: 40 },
  { bsn: 46, price: 40 },
  { bsn: 47, price: 90 },
  { bsn: 48, price: 40 },
  { bsn: 49, price: 40 },
  { bsn: 50, price: 90 },
  { bsn: 51, price: 40 },
  { bsn: 52, price: 40 },
  { bsn: 53, price: 90 },
  { bsn: 54, price: 40 },
]

const ACCTable = [
  { date: 17, price: 150 },
  { date: 18, price: 150 },
  { date: 19, price: 150 },
  { date: 20, price: 150 },
  { date: 21, price: 150 },
  { date: 22, price: 150 },
  { date: 23, price: 150 },
  { date: 24, price: 150 },
  { date: 25, price: 150 },
  { date: 26, price: 150 },
  { date: 27, price: 150 },
  { date: 28, price: 150 },
  { date: 29, price: 150 },
  { date: 30, price: 150 },
  { date: 31, price: 150 },
  { date: 1, price: 150 },
  { date: 2, price: 150 },
  { date: 3, price: 150 },
]

// cost per day for different types of accommodation
const accommodationPrices = {
  Yes: 150, // Standard room during camp (18-20)
  No: 0,
}
const beforeAfterCampPrices = {
  Yes: 150,
  No: 0,
}

function calculateCost(firstMealDate, firstMealType, lastMealDate, lastMealType, accommodation, participantType) {
  // If participant is Brahmachari, return 0
  if (participantType === "Brahmachari") {
    return 11
  }

  // Convert the dates to integers for easier comparison
  const firstDateInt = Number.parseInt(firstMealDate.split("-")[0])
  const lastDateInt = Number.parseInt(lastMealDate.split("-")[0])

  let totalCost = 0

  // Find the first meal's serial number
  const firstMeal = priceTable.find((meal) => meal.date === firstDateInt)
  let firstSN = 0
  if (firstMeal) {
    const mealType = firstMealType.toLowerCase()
    if (mealType === "breakfast" || mealType === "b") firstSN = firstMeal.bsn
    else if (mealType === "lunch" || mealType === "l") firstSN = firstMeal.lsn
    else if (mealType === "dinner" || mealType === "d") firstSN = firstMeal.dsn
  }

  // Find the last meal's serial number
  const lastMeal = priceTable.find((meal) => meal.date === lastDateInt)
  let lastSN = 0
  if (lastMeal) {
    const mealType = lastMealType.toLowerCase()
    if (mealType === "breakfast" || mealType === "b") lastSN = lastMeal.bsn
    else if (mealType === "lunch" || mealType === "l") lastSN = lastMeal.lsn
    else if (mealType === "dinner" || mealType === "d") lastSN = lastMeal.dsn
  }

  console.log("First SN:", firstSN, "Last SN:", lastSN)

  // let no_of_stay_days = Math.round((lastSN - firstSN + 1) / 3);
  const no_of_stay_days = Math.round((lastSN - firstSN + 1) / 3)
  console.log("No of stay days:", no_of_stay_days)

  let AccCost = 0
  if (accommodation && accommodation !== "No") {
    // FIX: The loop must iterate over the date entries in ACCTable to handle rollovers (31 -> 1).

    // 1. Find the starting index for the accommodation charge in ACCTable
    const firstAccIndex = ACCTable.findIndex((e) => e.date === firstDateInt)

    // 2. Iterate for 'no_of_stay_days' starting from that index
    if (firstAccIndex !== -1) {
      for (let i = 0; i < no_of_stay_days; i++) {
        const accIndex = firstAccIndex + i

        if (accIndex < ACCTable.length) {
          const accDay = ACCTable[accIndex]
          // console.log(i, accDay.price);
          AccCost += accDay.price
        } else {
          // Safety break if we run out of days in the ACCTable
          break
        }
      }
    }
  }

  for (let i = firstSN; i <= lastSN; i++) {
    const ind = bsnpricetable.find((e) => e.bsn === i) // finding key
    if (ind) {
      // console.log(i, ind.price);
      totalCost += ind.price
    }
  }
  console.log("Total meals cost:", totalCost)
  console.log("Total ACC cost:", AccCost)

  totalCost += AccCost
  console.log("Total cost:", totalCost)
  return totalCost
}

export default calculateCost

// calculateCost("31-dec", "lunch", "02-jan", "dinner", "Yes", "mentor");
// calculateCost("30-dec", "lunch", "01-jan", "dinner", "Yes", "mentor");
// calculateCost("30-dec", "lunch", "31-dec", "dinner", "Yes", "mentor");
