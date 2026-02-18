export interface Meal {
  id: string
  name: string
  description: string
  price: number
  calories: number
  protein: number
  carbs: number
  fats: number
  image: string
  dietaryTags: string[]
  goals: string[]
  planType?: "WeightLoss" | "WeightGain" | "Maintenance"
  mealTime?: "Breakfast" | "Lunch" | "Dinner"
  dietType?: "Veg" | "Non-Veg" | "Vegan"
}

export const MOCK_MEALS: Meal[] = [
  // BREAKFAST - WEIGHT LOSS (1-20)
  { id: "B001", name: "Oats with Berries", description: "Wholesome rolled oats with mixed berries, honey, and chia seeds", price: 150, calories: 250, protein: 8, carbs: 45, fats: 5, image: "/oats-with-fresh-fruits-and-honey.jpg", dietaryTags: ["veg", "high-fiber", "low-fat"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B002", name: "Idli with Sambar", description: "Soft steamed rice cakes with lentil sambar and coconut chutney", price: 120, calories: 220, protein: 8, carbs: 42, fats: 2, image: "/idli-sambar.jpg", dietaryTags: ["veg", "low-fat", "gluten-free"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B003", name: "Poha with Vegetables", description: "Light flattened rice with mustard seeds, peanuts, and veggies", price: 100, calories: 240, protein: 7, carbs: 38, fats: 5, image: "/indian-poha-with-peanuts-and-herbs.jpg", dietaryTags: ["veg", "gluten-free"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B004", name: "Egg White Toast", description: "Fluffy egg whites on whole wheat toast with tomato and herbs", price: 130, calories: 200, protein: 18, carbs: 20, fats: 3, image: "/egg-white-toast.jpg", dietaryTags: ["non-veg", "high-protein", "low-fat"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Non-Veg" },
  { id: "B005", name: "Upma with Greens", description: "Savory semolina with vegetables, spinach, and minimal oil", price: 110, calories: 260, protein: 8, carbs: 45, fats: 4, image: "/upma-greens.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B006", name: "Greek Yogurt Bowl", description: "Creamy Greek yogurt topped with granola, fresh berries, and honey", price: 140, calories: 240, protein: 15, carbs: 30, fats: 5, image: "/greek-yogurt-bowl.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B007", name: "Dosa with Sambar", description: "Crispy South Indian rice crepe with sambar and chutney", price: 130, calories: 280, protein: 9, carbs: 50, fats: 6, image: "/dosa-sambar.jpg", dietaryTags: ["veg", "gluten-free"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B008", name: "Steamed Momos", description: "Steamed vegetable dumplings with red chili sauce", price: 110, calories: 200, protein: 10, carbs: 35, fats: 3, image: "/momos-steamed.jpg", dietaryTags: ["veg", "low-fat"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B009", name: "Smoothie Bowl", description: "Colorful smoothie bowl with fresh fruits and granola", price: 160, calories: 270, protein: 12, carbs: 45, fats: 5, image: "/smoothie-bowl.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B010", name: "Dhokla", description: "Steamed gram flour cake with mustard seeds and green chili", price: 100, calories: 220, protein: 8, carbs: 40, fats: 3, image: "/dhokla.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B011", name: "Whole Wheat Pancakes", description: "Fluffy pancakes with fresh berries and honey", price: 150, calories: 260, protein: 10, carbs: 48, fats: 5, image: "/pancakes-berries.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B012", name: "Cucumber Detox Juice", description: "Fresh cucumber and mint detox juice", price: 80, calories: 50, protein: 2, carbs: 10, fats: 0, image: "/cucumber-detox.jpg", dietaryTags: ["veg", "vegan", "low-calorie"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B013", name: "Scrambled Egg Whites", description: "Protein-rich egg whites with spinach", price: 120, calories: 180, protein: 20, carbs: 8, fats: 2, image: "/egg-white-toast.jpg", dietaryTags: ["non-veg", "high-protein", "low-fat"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Non-Veg" },
  { id: "B014", name: "Protein Oats", description: "Oats with protein powder, berries, and almond butter", price: 160, calories: 280, protein: 18, carbs: 35, fats: 8, image: "/oats-with-fresh-fruits-and-honey.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B015", name: "Grilled Vegetable Salad", description: "Fresh salad with grilled vegetables and balsamic vinegar", price: 130, calories: 180, protein: 8, carbs: 25, fats: 5, image: "/grilled-vegetable-salad-with-balsamic.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B016", name: "Paneer Stir-fry", description: "Cottage cheese with vegetables", price: 140, calories: 240, protein: 16, carbs: 18, fats: 12, image: "/paneer-stir-fry-with-vegetables.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B017", name: "Boiled Eggs with Toast", description: "Boiled eggs with whole wheat toast", price: 100, calories: 200, protein: 16, carbs: 22, fats: 6, image: "/boiled-eggs-with-whole-wheat-toast.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Non-Veg" },
  { id: "B018", name: "Vegetable Soup Bowl", description: "Light vegetable soup with herbs", price: 90, calories: 120, protein: 6, carbs: 20, fats: 2, image: "/healthy-vegetable-soup-bowl.jpg", dietaryTags: ["veg", "vegan", "low-calorie"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B019", name: "Protein Smoothie", description: "Protein powder with fruits and milk", price: 140, calories: 220, protein: 20, carbs: 25, fats: 3, image: "/colorful-smoothie-bowl.png", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },
  { id: "B020", name: "Multigrain Cereal", description: "Multigrain cereal with low-fat milk and berries", price: 110, calories: 240, protein: 10, carbs: 42, fats: 4, image: "/oats-with-fresh-fruits-and-honey.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Breakfast", dietType: "Veg" },

  // LUNCH - WEIGHT LOSS (21-40)
  { id: "L001", name: "Dal Rice", description: "Indian lentil curry with steamed rice", price: 140, calories: 320, protein: 12, carbs: 55, fats: 4, image: "/dal-rice.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L002", name: "Roti with Vegetable Curry", description: "Whole wheat bread with mixed vegetable curry", price: 130, calories: 300, protein: 10, carbs: 48, fats: 6, image: "/roti-sabzi.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L003", name: "Tandoori Chicken", description: "Grilled chicken with lemon and herbs", price: 200, calories: 280, protein: 38, carbs: 8, fats: 10, image: "/tandoori-chicken.jpg", dietaryTags: ["non-veg", "high-protein", "low-carb"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L004", name: "Chana Masala", description: "Spiced chickpea curry with spinach", price: 120, calories: 280, protein: 14, carbs: 45, fats: 5, image: "/chana-masala.jpg", dietaryTags: ["veg", "vegan", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L005", name: "Biryani - Chicken", description: "Hyderabadi chicken biryani with basmati rice", price: 200, calories: 380, protein: 22, carbs: 52, fats: 12, image: "/biryani-chicken.jpg", dietaryTags: ["non-veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L006", name: "Palak Paneer", description: "Spinach and cottage cheese curry", price: 160, calories: 240, protein: 14, carbs: 16, fats: 12, image: "/palak-paneer.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L007", name: "Fish Curry", description: "South Indian fish curry with coconut and tamarind", price: 210, calories: 260, protein: 32, carbs: 10, fats: 8, image: "/fish-curry.jpg", dietaryTags: ["non-veg", "high-protein", "low-carb"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L008", name: "Butter Chicken", description: "Butter chicken in creamy tomato sauce", price: 190, calories: 320, protein: 28, carbs: 18, fats: 14, image: "/butter-chicken.jpg", dietaryTags: ["non-veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L009", name: "Aloo Gobi", description: "Cauliflower and potato dry curry", price: 110, calories: 200, protein: 6, carbs: 30, fats: 6, image: "/aloo-gobi.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L010", name: "Chole Bhature", description: "Chickpea curry with fried bread", price: 150, calories: 420, protein: 16, carbs: 65, fats: 10, image: "/chole-bhature.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L011", name: "Thai Green Curry", description: "Thai green curry with vegetables and coconut milk", price: 170, calories: 280, protein: 12, carbs: 28, fats: 12, image: "/thai-green-curry.jpg", dietaryTags: ["veg", "gluten-free"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L012", name: "Shrimp Fried Rice", description: "Shrimp fried rice with vegetables and egg", price: 200, calories: 340, protein: 28, carbs: 38, fats: 8, image: "/shrimp-fried-rice.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L013", name: "Rogan Josh", description: "Rogan josh lamb curry with aromatic spices", price: 220, calories: 340, protein: 32, carbs: 12, fats: 16, image: "/rogan-josh.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L014", name: "Baingan Bharta", description: "Roasted eggplant curry", price: 120, calories: 180, protein: 5, carbs: 28, fats: 6, image: "/baingan-bharta.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L015", name: "Rajma Rice", description: "Red kidney bean curry with steamed rice", price: 130, calories: 320, protein: 14, carbs: 55, fats: 3, image: "/rajma-rice.jpg", dietaryTags: ["veg", "vegan", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L016", name: "Vegetable Pulao", description: "Fragrant rice with mixed vegetables", price: 140, calories: 300, protein: 8, carbs: 52, fats: 5, image: "/vegetable-pulao.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L017", name: "Methi Chicken", description: "Chicken with fenugreek leaves", price: 200, calories: 300, protein: 36, carbs: 12, fats: 10, image: "/methi-chicken.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L018", name: "Naan with Paneer Tikka", description: "Naan bread with paneer tikka and mint chutney", price: 160, calories: 320, protein: 12, carbs: 45, fats: 10, image: "/naan-paneer.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L019", name: "Hakka Noodles", description: "Hakka noodles with vegetables and soy sauce", price: 150, calories: 310, protein: 10, carbs: 50, fats: 6, image: "/hakka-noodles.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L020", name: "Sambar Rice", description: "South Indian sambar with rice", price: 130, calories: 300, protein: 10, carbs: 52, fats: 3, image: "/sambar-rice.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },

  // LUNCH - WEIGHT LOSS (21-40) CONTINUED
  { id: "L021", name: "Paneer Tikka Masala", description: "Paneer tikka masala creamy tomato curry", price: 170, calories: 320, protein: 16, carbs: 22, fats: 16, image: "/tikka-masala.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L022", name: "Keema Rice", description: "Ground meat curry with basmati rice", price: 210, calories: 380, protein: 28, carbs: 45, fats: 12, image: "/keema-rice.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L023", name: "Dal Makhani", description: "Creamy black lentil curry", price: 150, calories: 320, protein: 12, carbs: 48, fats: 8, image: "/dal-makhani.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L024", name: "Fish Tikka", description: "Grilled and marinated fish tikka", price: 200, calories: 280, protein: 35, carbs: 8, fats: 10, image: "/fish-tikka.jpg", dietaryTags: ["non-veg", "high-protein", "low-carb"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L025", name: "Okra Fry", description: "Crispy lady fingers", price: 110, calories: 160, protein: 4, carbs: 22, fats: 6, image: "/okra-fry.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L026", name: "Dhokla Khaman", description: "Steamed gram flour cakes", price: 110, calories: 220, protein: 8, carbs: 38, fats: 4, image: "/dhokla-khaman.jpg", dietaryTags: ["veg"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L027", name: "Mixed Vegetable Curry", description: "Seasonal vegetables in curry", price: 120, calories: 200, protein: 8, carbs: 30, fats: 5, image: "/mixed-vegetable-curry.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },
  { id: "L028", name: "Chicken Tikka", description: "Tandoori chicken tikka skewers", price: 210, calories: 300, protein: 38, carbs: 8, fats: 12, image: "/chicken-tikka.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L029", name: "Saag Chicken", description: "Spinach and chicken curry", price: 190, calories: 300, protein: 34, carbs: 12, fats: 10, image: "/saag-chicken.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "L030", name: "Brown Rice Greens", description: "Brown rice with steamed greens", price: 130, calories: 280, protein: 10, carbs: 48, fats: 4, image: "/brown-rice-greens.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Lunch", dietType: "Veg" },

  // DINNER - WEIGHT LOSS (31-40)
  { id: "D001", name: "Grilled Fish", description: "Grilled fish with herbs and lemon", price: 200, calories: 250, protein: 36, carbs: 6, fats: 8, image: "/grilled-fish-dinner.jpg", dietaryTags: ["non-veg", "high-protein", "low-carb"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Non-Veg" },
  { id: "D002", name: "Tandoori Salmon", description: "Tandoori salmon with asparagus", price: 220, calories: 320, protein: 42, carbs: 8, fats: 14, image: "/tandoori-salmon.jpg", dietaryTags: ["non-veg", "high-protein", "low-carb"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Non-Veg" },
  { id: "D003", name: "Lentil Soup", description: "Red lentil soup with vegetables", price: 110, calories: 200, protein: 14, carbs: 32, fats: 2, image: "/lentil-soup.jpg", dietaryTags: ["veg", "vegan", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },
  { id: "D004", name: "Khichdi", description: "Rice and lentil comfort food", price: 100, calories: 240, protein: 10, carbs: 42, fats: 3, image: "/khichdi.jpg", dietaryTags: ["veg", "vegan", "gluten-free"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },
  { id: "D005", name: "Vegetable Soup", description: "Light vegetable soup with herbs", price: 90, calories: 120, protein: 6, carbs: 20, fats: 2, image: "/vegetable-soup.jpg", dietaryTags: ["veg", "vegan", "low-calorie"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },
  { id: "D006", name: "Boiled Chicken", description: "Boiled chicken breast with steamed vegetables", price: 180, calories: 240, protein: 38, carbs: 8, fats: 4, image: "/boiled-chicken.jpg", dietaryTags: ["non-veg", "high-protein", "low-fat"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Non-Veg" },
  { id: "D007", name: "Quinoa Bowl", description: "Quinoa with roasted vegetables", price: 160, calories: 280, protein: 12, carbs: 42, fats: 8, image: "/quinoa-dinner.jpg", dietaryTags: ["veg", "vegan", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },
  { id: "D008", name: "Dal Tadka", description: "Tempered lentil curry", price: 120, calories: 260, protein: 12, carbs: 45, fats: 3, image: "/dal-tadka.jpg", dietaryTags: ["veg", "vegan"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },
  { id: "D009", name: "Chicken Curry", description: "Chicken curry with onions and tomato", price: 190, calories: 300, protein: 34, carbs: 14, fats: 10, image: "/chicken-curry.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Non-Veg" },
  { id: "D010", name: "Paneer Do Pyaza", description: "Paneer with lots of onions", price: 150, calories: 260, protein: 14, carbs: 18, fats: 12, image: "/paneer-do-pyaza.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Weight Loss"], planType: "WeightLoss", mealTime: "Dinner", dietType: "Veg" },

  // WEIGHT GAIN MEALS (41-60)
  { id: "WG001", name: "Protein Weight Gain Shake", description: "Protein shake with whole milk, banana, and peanut butter", price: 180, calories: 550, protein: 28, carbs: 65, fats: 18, image: "/weight-gain-shake.jpg", dietaryTags: ["veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Breakfast", dietType: "Veg" },
  { id: "WG002", name: "Chicken Pulao", description: "Chicken pulao with meat and rice", price: 220, calories: 520, protein: 32, carbs: 58, fats: 16, image: "/chicken-pulao.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG003", name: "Meat Biryani", description: "Biryani with meat and basmati rice", price: 250, calories: 620, protein: 36, carbs: 68, fats: 20, image: "/meat-biryani.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG004", name: "Paneer Fried Rice", description: "Paneer fried rice with egg", price: 200, calories: 480, protein: 22, carbs: 52, fats: 18, image: "/paneer-fried-rice.jpg", dietaryTags: ["veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Veg" },
  { id: "WG005", name: "Mutton Curry", description: "Mutton curry with meat stew", price: 280, calories: 580, protein: 38, carbs: 42, fats: 22, image: "/mutton-curry.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG006", name: "Chicken Pasta", description: "Creamy chicken pasta", price: 210, calories: 520, protein: 28, carbs: 58, fats: 16, image: "/chicken-pasta.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG007", name: "Egg Noodles", description: "Egg noodles with vegetables", price: 180, calories: 420, protein: 18, carbs: 55, fats: 12, image: "/egg-noodles.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG008", name: "Fish Biryani", description: "Biryani with seafood", price: 240, calories: 580, protein: 34, carbs: 65, fats: 18, image: "/fish-biryani.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG009", name: "Prawn Biryani", description: "Prawn biryani with shrimp", price: 260, calories: 600, protein: 36, carbs: 62, fats: 20, image: "/prawn-biryani.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG010", name: "Dal Paneer", description: "Dal and paneer combination", price: 190, calories: 480, protein: 26, carbs: 48, fats: 14, image: "/dal-paneer.jpg", dietaryTags: ["veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Veg" },
  { id: "WG011", name: "Kheer", description: "Rice pudding with milk", price: 140, calories: 380, protein: 8, carbs: 58, fats: 14, image: "/sweets-kheer.jpg", dietaryTags: ["veg", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Breakfast", dietType: "Veg" },
  { id: "WG012", name: "Paneer Butter Masala", description: "Paneer butter masala with roti", price: 200, calories: 520, protein: 18, carbs: 55, fats: 22, image: "/paneer-butter-masala-with-roti.jpg", dietaryTags: ["veg", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Dinner", dietType: "Veg" },
  { id: "WG013", name: "Chicken Biryani", description: "Hyderabadi chicken biryani", price: 240, calories: 600, protein: 34, carbs: 68, fats: 18, image: "/biryani-chicken.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG014", name: "Fish Curry Rich", description: "Fish curry with extra coconut cream", price: 220, calories: 480, protein: 32, carbs: 32, fats: 18, image: "/fish-curry.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG015", name: "Butter Chicken Rich", description: "Rich butter chicken with cream", price: 210, calories: 540, protein: 28, carbs: 35, fats: 26, image: "/butter-chicken.jpg", dietaryTags: ["non-veg", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG016", name: "Rogan Josh Rich", description: "Rich rogan josh lamb curry", price: 250, calories: 580, protein: 36, carbs: 28, fats: 28, image: "/rogan-josh.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG017", name: "Dum Biryani Veg", description: "Vegetable biryani with ghee", price: 180, calories: 480, protein: 12, carbs: 62, fats: 18, image: "/vegetable-pulao.jpg", dietaryTags: ["veg", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Veg" },
  { id: "WG018", name: "Keema Paratha", description: "Ground meat with paratha bread", price: 220, calories: 550, protein: 26, carbs: 62, fats: 20, image: "/keema-rice.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "WG019", name: "Paneer Malai Kofta", description: "Creamy paneer balls", price: 200, calories: 500, protein: 16, carbs: 48, fats: 24, image: "/paneer-do-pyaza.jpg", dietaryTags: ["veg", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Veg" },
  { id: "WG020", name: "Shrimp Biryani", description: "Biryani with shrimp", price: 270, calories: 600, protein: 34, carbs: 65, fats: 20, image: "/shrimp-fried-rice.jpg", dietaryTags: ["non-veg", "high-protein", "high-calorie"], goals: ["Weight Gain"], planType: "WeightGain", mealTime: "Lunch", dietType: "Non-Veg" },

  // MAINTENANCE MEALS (60+)
  { id: "M001", name: "Grilled Vegetables", description: "Grilled vegetables with herbs", price: 150, calories: 200, protein: 8, carbs: 32, fats: 6, image: "/maintenance-grilled-veggies.jpg", dietaryTags: ["veg", "vegan"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M002", name: "Brown Rice Bowl", description: "Brown rice with protein and vegetables", price: 170, calories: 380, protein: 16, carbs: 52, fats: 8, image: "/maintenance-rice-bowl.jpg", dietaryTags: ["veg", "vegan"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M003", name: "Chicken Salad", description: "Grilled chicken salad with vegetables", price: 180, calories: 280, protein: 32, carbs: 18, fats: 8, image: "/maintenance-chicken-salad.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M004", name: "Vegetable Stir Fry", description: "Vegetable stir fry with tofu", price: 140, calories: 220, protein: 14, carbs: 28, fats: 6, image: "/maintenance-vegetable-stir-fry.jpg", dietaryTags: ["veg", "vegan", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M005", name: "Dal Roti", description: "Dal and roti bread", price: 130, calories: 320, protein: 14, carbs: 52, fats: 5, image: "/maintenance-dal-roti.jpg", dietaryTags: ["veg", "vegan"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M006", name: "Fish Rice", description: "Fish with steamed rice", price: 200, calories: 340, protein: 32, carbs: 42, fats: 6, image: "/maintenance-fish-rice.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M007", name: "Paneer Vegetable Mix", description: "Paneer with mixed vegetables", price: 160, calories: 280, protein: 18, carbs: 22, fats: 12, image: "/palak-paneer.jpg", dietaryTags: ["veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M008", name: "Chicken Rice", description: "Chicken with steamed rice", price: 190, calories: 360, protein: 36, carbs: 38, fats: 6, image: "/chicken-tikka.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M009", name: "Greek Salad", description: "Greek salad with feta cheese", price: 140, calories: 220, protein: 10, carbs: 18, fats: 12, image: "/salad-greek.jpg", dietaryTags: ["veg"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M010", name: "Caesar Salad Chicken", description: "Caesar salad with chicken", price: 170, calories: 300, protein: 28, carbs: 16, fats: 14, image: "/salad-caesar.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M011", name: "Fish Fry", description: "Fish fry with lemon", price: 190, calories: 320, protein: 34, carbs: 18, fats: 12, image: "/fish-fry.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M012", name: "Potato Curry", description: "Potato curry with spices", price: 110, calories: 240, protein: 6, carbs: 42, fats: 6, image: "/potato-curry.jpg", dietaryTags: ["veg", "vegan"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M013", name: "Mushroom Do Pyaza", description: "Mushroom with onions", price: 130, calories: 200, protein: 8, carbs: 28, fats: 6, image: "/mushroom-do-pyaza.jpg", dietaryTags: ["veg", "vegan"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Veg" },
  { id: "M014", name: "Shrimp Curry", description: "Shrimp curry with coconut", price: 210, calories: 280, protein: 32, carbs: 16, fats: 10, image: "/shrimp-curry.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
  { id: "M015", name: "Kasuri Methi Chicken", description: "Chicken with dried fenugreek", price: 200, calories: 320, protein: 36, carbs: 14, fats: 12, image: "/kasuri-methi-chicken.jpg", dietaryTags: ["non-veg", "high-protein"], goals: ["Maintenance"], planType: "Maintenance", mealTime: "Lunch", dietType: "Non-Veg" },
]

export const MOCK_DIET_PLANS = [
  {
    id: "plan1",
    name: "Weight Loss",
    description: "Lose weight with balanced, low-calorie meals",
    meals: MOCK_MEALS.filter((m) => m.planType === "WeightLoss"),
    targetCalories: 2000,
  },
  {
    id: "plan2",
    name: "Weight Gain",
    description: "Build muscle with high-calorie, protein-rich meals",
    meals: MOCK_MEALS.filter((m) => m.planType === "WeightGain"),
    targetCalories: 3500,
  },
  {
    id: "plan3",
    name: "Maintenance",
    description: "Maintain a balanced diet with mixed meals",
    meals: MOCK_MEALS.filter((m) => m.planType === "Maintenance"),
    targetCalories: 2500,
  },
]

export const USER_DATA = {
  username: "John Doe",
  email: "john@example.com",
  dietPlan: "Weight Loss",
  orders: 15,
  totalSpent: 4500,
}
