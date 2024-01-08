/**
 * This function replaces images URLs for RB-1541 A/B Test.
 * @param {Array} images
 */
export const replaceImageUrls = (images) => {
    const newImagesArray = images.map((el) => {
        // Row 2 (Washing machine)
        if (el.imageId == "174130") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a43a1edb-70bf-4f75-a7ff-13e339cc3890/sckne7/std/1000x1000/HP_F160230_WM_LandscapeBanner.jpg?format=JPEG&fillcolor=rgba:255,255,255";
        }
        if (el.imageId == "174131") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-332eb59e-00bd-4f1f-85ff-995e27bd8aad/sckne7/std/1000x1000/HP_F160230_WM_SelectingCycleInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174132") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-af939cc0-f7f8-4ca9-af8c-f1fd432d7694/sckne7/std/1000x1000/HP_F160230_WM_PressingACInteraction2_Crop.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174145") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a72d29d5-4cda-4e40-84c1-277e5b2797ee/sckne7/std/1000x1000/HP_F160230_WM_Drum.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 4 (Tumble dryer)
        if (el.imageId == "174263") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-51bf7285-eb34-4c3d-b2f1-0ef1ab231ab1/sckne7/std/1000x1000/HP_F154516_DR_Beauty2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174264") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-dcf7236f-3bca-478c-95f7-3b526d681d6d/sckne7/std/1000x1000/HP_F154516_DR_FoldingInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174265") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f62a03cd-35c5-4279-8d88-23e3255458ab/sckne7/std/1000x1000/HP_F154516_DR_PressingACInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174300") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f6602505-e07c-4e0b-91d2-4e7ac9add52c/sckne7/std/1000x1000/HP_F154516_DR_FoldingInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 5 (Tumble dryer)
        if (el.imageId == "174506") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-597bff14-a437-4940-8f5c-4b1acc23bb62/sckne7/std/1000x1000/HP_F154516_DR_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174507") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-29f91630-e7ac-4852-bc36-c17831f55492/sckne7/std/1000x1000/HP_F154516_DR_FoldingInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174508") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f6602505-e07c-4e0b-91d2-4e7ac9add52c/sckne7/std/1000x1000/HP_F154516_DR_FoldingInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174578") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-00fdc93e-94cd-4542-bf3f-2ce62e2bfb86/sckne7/std/1000x1000/HP_F154516_DR_Drum.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 6 (Washer dryer)
        if (el.imageId == "174539") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a16ebdbc-abf8-4455-8308-9ed3c0c08bdb/sckne7/std/1000x1000/HP_F165186_WD_Portrait.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174541") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-4f7f34c8-bfd5-4b8c-8ef2-c34a70006a32/sckne7/std/1000x1000/HP_F165186_WD_FoldingInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174547") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-3d06eec4-c5c1-4f6e-9ef8-2e74ffaa7155/sckne7/std/1000x1000/HP_F165186_WD_LoadingInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174553") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-b694b5fc-d835-4a77-98e6-68c5d30db5f3/sckne7/std/1000x1000/HP_F165186_WD_Angled.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 7 (Washer dryer)
        if (el.imageId == "174408") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a16ebdbc-abf8-4455-8308-9ed3c0c08bdb/sckne7/std/1000x1000/HP_F165186_WD_Portrait.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174409") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-4f7f34c8-bfd5-4b8c-8ef2-c34a70006a32/sckne7/std/1000x1000/HP_F165186_WD_FoldingInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174410") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-3d06eec4-c5c1-4f6e-9ef8-2e74ffaa7155/sckne7/std/1000x1000/HP_F165186_WD_LoadingInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174413") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-b694b5fc-d835-4a77-98e6-68c5d30db5f3/sckne7/std/1000x1000/HP_F165186_WD_Angled.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 8 (Washer dryer)
        if (el.imageId == "174397") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a16ebdbc-abf8-4455-8308-9ed3c0c08bdb/sckne7/std/1000x1000/HP_F165186_WD_Portrait.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174398") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-4f7f34c8-bfd5-4b8c-8ef2-c34a70006a32/sckne7/std/1000x1000/HP_F165186_WD_FoldingInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174399") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-3d06eec4-c5c1-4f6e-9ef8-2e74ffaa7155/sckne7/std/1000x1000/HP_F165186_WD_LoadingInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174404") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-b694b5fc-d835-4a77-98e6-68c5d30db5f3/sckne7/std/1000x1000/HP_F165186_WD_Angled.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 9 (Washer dryer)
        if (el.imageId == "174468") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-2e26d2e6-7269-4687-8b59-fb799408e2e7/sckne7/std/1000x1000/HP_F165286_WD_LandscapeBanner.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174469") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f02ea1ce-22ef-486a-8788-8fb8bdfd20db/sckne7/std/1000x1000/HP_F165286_WD_FoldingInAction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174470") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-069482c0-3f94-487c-99e9-64df258e71e8/sckne7/std/1000x1000/HP_F165286_WD_FoldingInMotion.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174472") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-10bbf82a-90e4-48f2-9c61-30ad0eb0fa32/sckne7/std/1000x1000/HP_F165286_WD_ActiveCarePortrait.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 10 (Washer dryer)
        if (el.imageId == "175012") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-2e26d2e6-7269-4687-8b59-fb799408e2e7/sckne7/std/1000x1000/HP_F165286_WD_LandscapeBanner.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "175014") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-f02ea1ce-22ef-486a-8788-8fb8bdfd20db/sckne7/std/1000x1000/HP_F165286_WD_FoldingInAction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "175016") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-069482c0-3f94-487c-99e9-64df258e71e8/sckne7/std/1000x1000/HP_F165286_WD_FoldingInMotion.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "175022") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-10bbf82a-90e4-48f2-9c61-30ad0eb0fa32/sckne7/std/1000x1000/HP_F165286_WD_ActiveCarePortrait.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 12 (Fridge freezer)
        if (el.imageId == "173977") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/e5aa3ab4-64f4-4a4a-8740-831c6f60ca8d/sckne7/std/1540x866/pi-77492ac8-a26f-4bfd-ac82-4f?v=53&dpr=125"
        }
        if (el.imageId == "173978") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-60726dd3-f1bc-4b6c-8a1f-a4b4df433560/sckne7/std/1000x1000/HP_F164703_FF_TopOpen.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "173979") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-d28dce83-c99b-4483-b274-474ad7052c01/sckne7/std/1000x1000/HP_F164703_FF_TotalNoFrostInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "252859") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a3616d04-bc8c-47d8-a003-2f7903bc5134/sckne7/std/1000x1000/HP_F164703_FF__BannerInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 13 (Fridge freezer)
        if (el.imageId == "174030") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-77492ac8-a26f-4bfd-ac82-4f6a6fe62551/sckne7/std/1000x1000/HP_F164703_FF_Beauty2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174031") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a3616d04-bc8c-47d8-a003-2f7903bc5134/sckne7/std/1000x1000/HP_F164703_FF__BannerInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174032") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-d9efc3f4-c20a-47a4-a30f-54aca34934fd/sckne7/std/1000x1000/HP_F164703_FF_TotalNoFrostInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174033") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-67781572-84bf-48e7-a18b-3d7632497aaa/sckne7/std/1000x1000/HP_F164703_FF__BannerInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 14 (Fridge freezer)
        if (el.imageId == "174001") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-77492ac8-a26f-4bfd-ac82-4f6a6fe62551/sckne7/std/1000x1000/HP_F164703_FF_Beauty2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174002") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-60726dd3-f1bc-4b6c-8a1f-a4b4df433560/sckne7/std/1000x1000/HP_F164703_FF_TopOpeIdpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174003") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-d9efc3f4-c20a-47a4-a30f-54aca34934fd/sckne7/std/1000x1000/HP_F164703_FF_TotalNoFrostInteraction1.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "174004") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-67781572-84bf-48e7-a18b-3d7632497aaa/sckne7/std/1000x1000/HP_F164703_FF__BannerInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 15 (Oven)
        if (el.imageId == "164465") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cc3a3c9-158a-4fbe-9220-3b48c7587b23/sckne7/std/1000x1000/HP_F096800_OV_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164466") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cdac034-7dca-4b67-9cec-69a30e35f8d2/sckne7/std/1000x1000/HP_F096800_OV_DadInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164468") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-393c4922-e970-42a7-b4b1-c99d62991ed0/sckne7/std/1000x1000/HP_F096800_OV_DadAndDaughterInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164472") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-aa9cf7f4-cf7a-4220-8dc3-da811216c373/sckne7/std/1000x1000/HP_F096800_OV_CleaningMale.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 16 (Oven)
        if (el.imageId == "164428") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cc3a3c9-158a-4fbe-9220-3b48c7587b23/sckne7/std/1000x1000/HP_F096800_OV_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164430") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cdac034-7dca-4b67-9cec-69a30e35f8d2/sckne7/std/1000x1000/HP_F096800_OV_DadInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164431") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-393c4922-e970-42a7-b4b1-c99d62991ed0/sckne7/std/1000x1000/HP_F096800_OV_DadAndDaughterInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164433") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-aa9cf7f4-cf7a-4220-8dc3-da811216c373/sckne7/std/1000x1000/HP_F096800_OV_CleaningMale.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 17 (Oven)
        if (el.imageId == "164378") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cc3a3c9-158a-4fbe-9220-3b48c7587b23/sckne7/std/1000x1000/HP_F096800_OV_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164381") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cdac034-7dca-4b67-9cec-69a30e35f8d2/sckne7/std/1000x1000/HP_F096800_OV_DadInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164383") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-393c4922-e970-42a7-b4b1-c99d62991ed0/sckne7/std/1000x1000/HP_F096800_OV_DadAndDaughterInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164384") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-aa9cf7f4-cf7a-4220-8dc3-da811216c373/sckne7/std/1000x1000/HP_F096800_OV_CleaningMale.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 18 (Microwave)
        if (el.imageId == "164208") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cc3a3c9-158a-4fbe-9220-3b48c7587b23/sckne7/std/1000x1000/HP_F096800_OV_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164209") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-393c4922-e970-42a7-b4b1-c99d62991ed0/sckne7/std/1000x1000/HP_F096800_OV_DadAndDaughterInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 19 (Microwave)
        if (el.imageId == "164232") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-0cc3a3c9-158a-4fbe-9220-3b48c7587b23/sckne7/std/1000x1000/HP_F096800_OV_Beauty.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164233") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-aa9cf7f4-cf7a-4220-8dc3-da811216c373/sckne7/std/1000x1000/HP_F096800_OV_CleaningMale.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "164237") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-393c4922-e970-42a7-b4b1-c99d62991ed0/sckne7/std/1000x1000/HP_F096800_OV_DadAndDaughterInteraction2.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 20 (Hob)
        if (el.imageId == "165633") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-d108e1f6-3e65-4402-8454-8736b0431316/sckne7/std/1000x1000/HP_F158062_HB_Angled.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165634") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-6390bb03-e300-4530-b64e-7a8fede15df2/sckne7/std/1000x1000/HP_F158062_HB_EasyClean.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165635") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-10b7d13d-fbe7-4d49-ba0d-e97ce97bce5e/sckne7/std/1000x1000/HP_F158062_HB_MyMenuBoiling.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165637") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-8c0dc304-9514-43e6-9bdd-52bc11aa2e3b/sckne7/std/1000x1000/HP_F158062_HB_ProductInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 21 (Hob)
        if (el.imageId == "165591") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a9b8c496-d05f-413d-a42a-eb304bc1513e/sckne7/std/1000x1000/HP_F158062_HB_Wide.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165592") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-d108e1f6-3e65-4402-8454-8736b0431316/sckne7/std/1000x1000/HP_F158062_HB_Angled.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165593") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-8c0dc304-9514-43e6-9bdd-52bc11aa2e3b/sckne7/std/1000x1000/HP_F158062_HB_ProductInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }

        // Row 22 (Hob)
        if (el.imageId == "165808") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-a9b8c496-d05f-413d-a42a-eb304bc1513e/sckne7/std/1000x1000/HP_F158062_HB_Wide.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
        if (el.imageId == "165809") {
            el.imageUrl = "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/pi-8c0dc304-9514-43e6-9bdd-52bc11aa2e3b/sckne7/std/1000x1000/HP_F158062_HB_ProductInteraction.jpg?format=JPEG&fillcolor=rgba:255,255,255"
        }
				return el;
    })
		return newImagesArray;
};
