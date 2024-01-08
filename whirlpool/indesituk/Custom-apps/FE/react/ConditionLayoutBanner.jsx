import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ConditionLayoutBanner() {
  const CSS_HANDLES = [
    "ConditionLayoutBanner_container",
    "ConditionLayoutBanner_textContainer",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

  const [result, setResult] = useState(false);
  const [bannerHTML, setBannerHTML] = useState("");

  const checkHistory = window.history ? window.history.state.key : "";

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [result, checkHistory]);

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  let pathName;

  const checkPath = () => {
    if (
      window.location.href &&
      window.location.href !== undefined &&
      window.location.href !== null
    ) {
      window.location.pathname.split("/")[3] === undefined
        ? (pathName = "")
        : (pathName = window.location.pathname.split("/")[3]);
      setBannerHTML(pathName);
      setResult(true);
    }
  };
  console.log(bannerHTML);

  if(result) {
    return (
        <>
            <div className={handles.ConditionLayoutBanner_container}>
                {
                    bannerHTML === "ovens" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>

                        </div>
                    ) :
                    bannerHTML === "" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Ovens<br/>
                            Discover Indesit’s ovens lineup in the catalogue. Our best technology for baking, broiling and roasting comprises a series of models designed to enhance your cooking experience. Easy to install and having a modern and captivating design, Indesit ovens are the ideal solution for having an efficient appliance in your home.<br/>
                            Our catalog contains electric and gas ovens, allowing you to select the one that best fits your needs: different programs, for each type of cooking, will help you to successfully prepare any dish. The latest and most advanced models considerably reduce the consumption of the appliance. Among the most appreciated features, catalytic, hydrolytic or pyrolytic self-cleaning stand out, a support of great value to speed up the cleaning after use, and thus be able to concentrate on the preparation of exquisite dishes.<br/>
                            Moreover, the Aria Ovens Turn&Go function allows you to discover new recipes. Simply install the Turn&Go app on your device, and use the phone camera to take a picture of your main ingredient. The app will suggest an easy recipe to bake with your appliance, picking from a database with over 100 delicious dishes.<br/>
                            Among the most popular models, Indesit’s double ovens stand out. They allow you to cook two different meals  at the same time, optimizing preparation times. The double compartment also allows you to select the most suitable space for each need: the main compartment for large dishes, while the upper shelf for side dishes and for broiling with the grill. A modern, practical and functional choice in all respects.<br/>
                            Indesit ovens come in different colors and designs. Discover the online catalog and choose the one that best adapts to your style, composing a functional kitchen with an attractive appearance. Combine it with a practical 
                            <a href="https://www.indesit.co.uk/products/cooking/microwaves">microwave oven</a>
                            , or select one matching Indesit’s hobs, and equip your kitchen with great performing appliances.
                        </div>
                    ) :
                    bannerHTML === "hobs" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Hobs<br/>
                            Indesit offers a wide range of hobs with a functional and modern design, perfect for giving a touch of originality to your kitchen and rendering cooking easy. These are products with simple and intuitive use, available both with gas burners or energy-saving induction elements.<br/>
                            Gas cooktops have hobs of different sizes, with dedicated knobs positioned frontally or on the side. The dispensers control with accuracy the size of the flame, providing the exact heat that best suits your cooking. Induction models can be easily installed with a requiring only an electrical socket nearby. Characterized by a heating system that acts directly on compatible pots, they provide fast cooking and optimal energy savings. The surface of the cooktops with induction hobs is perfectly smooth, and therefore has two advantages: it facilitates the cleaning and it gives a modern and attractive style to the kitchen. They are also equipped with intuitive controls that improve daily use, adapting the power to preparation of all types of recipes. Electric hobs are also available, the lineup contains models with different number of burners, easy to install next to an<br/>
                            <a href="https://www.indesit.co.uk/products/cooking/cookers">Indesit cooker</a>
                            so as to combine available hobs with additional plates.<br/>
                            Great attention has been paid to the safety of all hobs types. The fully-equipped models of the catalogue have devices that, if necessary, automatically cut off the supply of gas or electricity. Design, safety and ease of use: the characteristics of Indesit hobs make them the most suitable solution for every type of need. A quality appliance designed to facilitate your cooking, allowing you to always give your best when cooking.
                        </div>
                    ) :
                    bannerHTML === "hoods" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Hoods<br/>
                            Choose the efficiency and modern design of Indesit cooker hoods. Essential appliances to equip any kitchen, they have been designed to offer exceptional extraction power for all those who want trouble-free cooking without having to worry about steam ruining the furniture, thus ensuring a healthy environment, free of grease and odors.<br/>
                            Thanks to their technology and compact structure, measuring only a few centimeters deep, Indesit hoods are super efficient and silent when in use. Choose the model you prefer; they are available in varieties such as traditional or chimney shaped. You can opt for built-in extractor hoods, which blend in perfectly with your kitchen cabinet doors, harmonizing with all your other interior finishings. Or what about wall hoods that are ideal if your hob is placed along a wall, thus becoming a feature of design that will stand out among all your other fittings and furnishings. Ranging in size from 60 to 90 cm our hoods have been designed to adapt to any type of space in an efficient and functional manner. All of them ensure perfect lighting thanks to the LED spotlights which allow the light to spread directly to every point and create a pleasant and welcoming work environment. Indesit hoods also offer excellent filtering performance thanks to the adjustable power and speed of extraction, which can be selected with the easy-to-use control keys.<br/>
                            To facilitate cleaning, the aluminum grease filters are removable and dishwasher safe. The timeless design and the materials used such as stainless steel or glass, integrate well with most of the kitchen hoods and with the other appliances and <br/>
                            <a href="https://www.indesit.co.uk/products/cooking/hobs">hobs</a>
                            in our range. With Indesit you get a 2-year warranty included. Consult our catalog and find the store closest to you where you can buy your Indesit cooker hood.
                        </div>
                    ) :
                    bannerHTML === "microwaves" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Microwave Ovens<br/>
                            Indesit has a wide range of high quality built-in microwave ovens, for rapid preparation and defrosting: browse the online catalogue, compare products and choose the perfect appliance to get the most out of your kitchen.<br/>
                            Compact and practical design, advanced features, user-friendly controls and programs suitable for all your needs: an Indesit microwave oven is a great little helper for your daily chores in the kitchen. Designed to offer you versatile and reliable support, it is essential for both quick preparation of food as well as in making challenging recipes; a real must-have for all occasions.<br/>
                            Inside its elegant contours lies the best technology for all your recipes: Indesit Aria microwaves provide Double Power Wave technology which, using double wave intensity, improves the heating and defrosting function for your food. A real guarantee for evenly cooked, tasty and delicious dishes. The automatic cooking system will become your ally for every dish; you simply select the kind of food you want to cook and the microwave oven will do the rest. This technology independently sets the cooking time to always ensure the best result, whether you are cooking or defrosting, adapting controls according to the weight and type of food. You will also be able to achieve exceptional browning and crunchy results with the Quartz Grill, a perfect way to achieve rapid browning.<br/>
                            Thanks to their modern and well-finished design, our built-in microwave ovens are easy to install inside a kitchen cabinet. Being compact and practical, they can be combined with an <br/>
                            <a href="https://www.indesit.co.uk/products/cooking/ovens">Indesit oven</a>
                            , or placed next to the stove top, to complete your kitchenette with a functional and versatile appliance. Discover them in their steel-colored versions, or in the models with more compact shapes, suitable even if you have limited space. You will be amazed by Indesit technology, so come and discover the best microwave ovens in the catalogue.
                        </div>
                    ) :
                    bannerHTML === "cookers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Cookers<br/>
                            Discover Indesit's electric and gas cookers, appliances carefully designed to better manage all types of cooking. They consist of a 4-burner hob and a practical oven positioned below it, and are equipped with everything you need to help you cook all kinds of recipes.<br/>
                            Their compact, functional and simple design in classic colors will enable you to fit gas and electric cookers harmoniously in any furnishing arrangement. The minimalistic shape of the frame design helps to facilitate cleaning, thanks to the absence of grooves between the hob burners. By inserting a small amount of water into the cavity of the kitchen oven, you can also activate the automatic program to eliminate all traces of residual fat in just 35 minutes, without using any detergent. The all-glass door allows you to have complete visibility, in order to constantly monitor whatever you are preparing.<br/>
                            The hob has four burners of different sizes, suitable for preparing all types of food, using any size of pots and pans. The panel with the front knobs is designed to help you better manage the intensity of the flame, in order to obtain the precise type of cooking you need. It comes complete with all the most useful functions: the oven provides the Indesit kitchen with a series of cooking options and innovative programs and then there is the double-cooking function, for example, which is recommended for those who need to prepare ready-made dishes rapidly, without having to preheat the oven. For the most delicate dishes that require uniform leavening, Indesit has designed a lower heating system for these kitchens which, combined with the pastry program, allows you to obtain perfect results thanks to the rear resistance improved by optimal ventilation. You can also avoid the formation of steam and odors thanks to the practical 
                            <a href="https://www.indesit.co.uk/products/cooking/hoods">wall hood</a>
                            above the hob, compactly built to be in line with the design of the kitchen. Consult the online catalogue and choose the most suitable gas or electric cooker that meets your needs.
                        </div>
                    ) :
                    bannerHTML === "frigdes" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Fridges<br/>
                            A modern and reliable refrigerator is your main ally in the kitchen. The Indesit catalogue offers you a wide selection of innovative and practical models, designed to preserve the quality of ingredients and foods of all kinds, thanks to the latest technologies in food preservation. Discover the different models and compare their features to find the solution that best suits your needs in the kitchen.<br/>
                            Our series of refrigerators ranges from free-standing appliances, easy to place in any space in the room, to built-in ones, designed to help you optimize space and to integrate your fridge into your own furnishing context. There is also a wide choice of refrigerator sizes and capacity, with larger or more compact models, to meet the needs of those with limited space in the kitchen. Common to all the best refrigerators are the technological features for cooling and managing the internal temperature: the NoFrost function prevents the formation of frost by keeping food dry, while the fan optimally distributes fresh air throughout the space inside.<br/>
                            The refrigerator motor is also silent and effective, and thanks to its excellent performance and high energy efficiency, it guarantees long-term savings and minimal environmental impact. A further key characteristic of Indesit refrigerators is the choice of design, which combines modern and user-friendly design with the utmost attention to performance and practicality. The interiors are in fact designed to facilitate the organization of different types of food and ingredients, helping you to position the food within the series of compartments and shelves designed to store bottles, eggs, meats and vegetables.<br/>
                            In the combined and double door models, there is the space dedicated to the cold storage, which combines the classic functions of the refrigerator with those of 
                            <a href="https://www.indesit.co.uk/products/cooling/freezers">Indesit freezers</a>
                            . Discover the refrigerators included in the catalogue, and choose Indesit technology for your kitchen: conserve and preserve your food in the best possible way with a modern and easy to use appliance.
                        </div>
                    ) :
                    bannerHTML === "freezers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Freezers<br/>
                            Discover Indesit freezer lineup, products with a linear and clean design with which you can freeze and preserve your food at its best. Due to their rational and compact shapes, they can easily adapt to any type of environment: a modern, functional and easy to install solution, perfect for every need.<br/>
                            On our online catalog you can find different models, with features and colors designed to meet the style, furnishing and functionality needs of your kitchen: the wide range of colors available and the refined design allow them to be perfectly inserted into any home style. You can choose between vertical freezers, with shapes similar to those of a 
                            <a href="https://www.indesit.co.uk/products/cooling/fridges">refrigerator</a>
                            , and horizontal: the former are the right option for those who need additional refrigeration space. Their design makes them the most suitable choice to create a space dedicated to freezing and storing ingredients and prepared meals. These models are available in a freestanding version with up to 7 drawers and adjustable feet. Chest freezers, on the other hand, are offered in two different sizes: a narrow and long one with a very large basket, ideal for those with limited space, and a larger one with up to 4 baskets, suitable for cellars and basements. Balanced hinges simplify and facilitate the opening operations of the upper door, soften the movement of the door avoiding abrupt closing.<br/>
                            The freezer has an interface for adjusting the temperature and freezing programs that is easy to read and use, so you can always keep your food in the right way and enjoy its organoleptic properties for a long time. The most energy efficient appliances also allow you to save money and minimize their environmental impact. Consult the online catalog and choose the freezer that best suits your needs.
                        </div>
                    ) :
                    bannerHTML === "washing-machines" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Washing Machines<br/>
                            Modern design and advanced technology in the assortment of washing machines produced by Indesit, with a line of models designed to ensure you have perfect laundry every day. Clean and perfumed garments after every cycle, with optimal results even for the most delicate and demanding fabrics. The catalogue contains a host of different models, each with innovative features that will satisfy all kinds of washing requirements.<br/>
                            The Innex models are equipped with Push&Go technology, designed to allow you to start the appliance and select the program by simply pressing a button. The inverter motor effectively removes more than 20 types of stains through a special movement of the drum, which increases the cleaning power of your detergent. The rotation inversion is calibrated in such a way as to reduce vibrations in all phases, ensuring maximum silence, while pampering your garments during every wash.<br/>
                            Through an innovative sensor, Indesit washing machines automatically optimize water consumption, using just the right amount necessary for the laundry loaded inside the drum. This feature is also found in the MyTime line, with models that regulate the flow, enabling you, with small loads, to save water, energy and time. Indesit washing machines are practical and easy to use, thanks to programs that indicate the best settings for any type of laundry: the MyTime models, for example, are equipped with three full load FastCycles under 1 hour, and with dedicated settings for different types of fabrics.<br/>
                            The compactness and modern design of our washing machines mean they fit in perfectly with any type of furnishing arrangement, allowing you to combine them with an 
                            <a href="https://www.indesit.co.uk/products/laundry/dryers">Indesit dryers</a>
                            to make the perfect laundry corner. Compare the models available in the catalogue and select the Indesit washing machine that best suits your needs.
                        </div>
                    ) :
                    bannerHTML === "dryers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Dryers<br/>
                            Indesit dryers stand out for the many programs available and high energy-saving performance. They are equipped with innovative technologies to perfectly dry each garment and for treating their fabrics in the best manner. We offer a wide range of models and sizes: heat pump, free-standing and built-in dryers to suit every need and space in your home. The dryers have a drum load capacity ranging from 7kg to 9kg and a very high energy efficiency. Indesit dryers are also equipped with innovative technology for noise reduction.<br/>
                            Indesit tumble dryers provide you with a wide choice of programs: the mixed cycle, designed for a load of up to 3kg, can receive all types of garments; the Fast45 program dries your clothes in just 45 minutes; there is also a program specifically designed for duvets and padded fabrics, which therefore ensures perfect results and maximum softness. Among the functions included, the Shoes rack option designed exclusively for footwear is also very useful.<br/>
                            Indesit appliances are also practical and easy to use, thanks to their intuitive control panel. Pushing a single button is sufficient to let the machine automatically set the desired and most appropriate parameters for an optimal result. Perfect also from a design point of view, you can choose from a wide variety of colors, such as black, white, steel and many more. To meet every need, our lineup also includes 
                            <a href="https://www.indesit.co.uk/products/laundry/washer-dryers">Indesit washer-dryers</a>
                            which allow to save space and energy with a complete appliance for your laundry. Explore our extensive catalog, compare the products and find your closest store to buy your new Indesit dryer.
                        </div>
                    ) :
                    bannerHTML === "washer-dryers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Washer Dryers<br/>
                            Compact and efficient, Indesit washer dryers guarantee you perfectly clean laundry, thanks to the combination of the best technologies for the treatment of all types of garments and fabrics. The elegant and functional design makes it easy to install in any area of the house equipped with water and electricity connections. This is the ideal solution for anyone who needs to save space by having a single combined appliance.<br/>
                            It will be easy for you to select the right model, with our large range of appliances of all kinds: built-in washer-dryers can be easily installed inside your laundry room cabinet, while the freestanding ones adapt perfectly to any furnishing arrangement, thanks to their elegant design that also characterizes the washing machines and 
                            <a href="https://www.indesit.co.uk/products/laundry/dryers">dryers in Indesit catalogue.</a><br/>
                            The real strong point of our washer-dryers lies in the technology used to produce them; they are the perfect combination of efficiency and versatility. The front panel is designed to maximize the potential and use of the product; e.g. the models of the Innex range have functions to program the most suitable cycle for your laundry at maximum speed. The Push&Go technology, for example, allows you to activate a program with a single press of a button, ensuring you have clean and ready garments in less than one hour. Our Indesit washer-dryers have numerous advanced features, with specific cycles for treating delicate or unusual fabrics, which give you various options to better wash your laundry. The sports program, for example, is specifically dedicated to clothing for physical activity, from gym suits to sneakers and running shoes.<br/>
                            The highly effective ‘extra’ washing functions serve to remove the most stubborn stains. It is also possible to program the cycle to start the washer-dryer at the most appropriate time of the day for you. Browse the catalogue, discover and compare the products online. Choose the efficiency of Indesit technology for your laundry.
                        </div>
                    ) :
                    bannerHTML === "dishwashers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Indesit Dishwashers<br/>
                            You will always get top results with Indesit dishwashers, modern appliances equipped with innovative washing programs for dishes and cutlery. Discover the effectiveness of a perfect wash, with the models in our online catalogue.<br/>
                            The Indesit selection consists of numerous built-in models, ideal for installation inside your kitchen cabinet, or free-standing, designed for easy positioning in any part of your house with water and electricity connections. These built-in dishwashers have a simple and clean style, with controls for choosing the washing program located in the upper part of the door, so that they can be used effortlessly once inserted in any dedicated compartment of the kitchen.<br/>
                            Our freestanding dishwashers have simple and modern designs, actually embellishing your spaces with a contemporary style appliance, which will visually integrate nicely with your home decor. In particular, the free-standing models blend perfectly with other appliances in the Indesit range, and can thus be placed side by side with the oven or 
                            <a href="https://www.indesit.co.uk/products/cooling/fridges">refrigerator</a>
                            in order to create a modern and fully equipped area for all kitchen activities.
                            Indesit dishwashers boast innovative washing systems and technologies, including Fast &amp; Clean technology: with a simple touch, your dishes get a thorough cleaning in less than half an hour. At the end of the cycle the door will automatically open 10 degrees, a function linked to a temperature control algorithm. By releasing the steam, the system increases the drying speed by 25%. Extra model dishwashers are equipped with a new cycle designed for large dishes, which allows you to remove the upper basket to obtain a volume up to 53 cm. You are guaranteed maximum cleanliness with the Extra Hygiene cycle, which rinses at 72 ° C and removes up to 99% of bacteria (endorsed by Swissatest). Appliances with the Push&amp;Go program will easily start an efficient cycle with no need for pre-wash. A series of complete features for every need, in a single appliance that meets all your daily needs in the kitchen.
                        </div>
                    ) :
                    bannerHTML === "dishwashers" ? (
                        <div className={handles.ConditionLayoutBanner_textContainer}>
                            Built-in Coffee Machine Indesit<br/>
                            For a real caffetteria experience in your own home, Indesit has created built-in coffee machines with the right technology to comfortably enjoy any type of hot drink. The built-in system let you adorn your kitchen with an elegant state-of-the-art appliance. You can easily prepare any type of hot drink, from herbal teas to espresso coffee, from cappuccino to hot chocolate. You just need to select the appropriate function, and the coffee machine will do the rest.<br/>
                            Thanks to the machine's steam nozzle, you can froth the milk to prepare delicious, hot and thick cappuccinos, ideal for a break on a winter evening or for a tasty breakfast. If, on the other hand, you prefer the energy and unmistakable character of American coffee, the dosing mechanism will enable you to prepare a large cup in a few minutes. Another thing not to be missed is the program for strong espresso, a ‘must’ to better savour the unmistakable flavor of your favorite blend. With a simple touch, you will have the best drink in the comfort of your home.<br/>
                            Perfect from the point of view of their essential and minimalist design, Indesit coffee machines will effortlessly fit in with the entire range of built-in appliances in our catalogue, such as hobs, 
                            <a href="https://www.indesit.co.uk/products/cooking/microwaves">microwave ovens</a>
                            and ovens, all combining to make your kitchen elegant and functional.
                            Notable for their compact size, Indesit built-in coffee machines, with semi-automatic integrated water tanks and spouts, are easy and safe to use whatever your needs and requirements may be, allowing you to prepare two cups at the same time. In making its appliances, Indesit never forgets the importance of the materials used; namely, stainless steel to ensure quality and high performance. Check out our collection and find the store closest to you to buy your Indesit built-in coffee machine.
                        </div>
                    ) :
                    ""
                }
            </div>
        </>
    )
  }
  return null
}