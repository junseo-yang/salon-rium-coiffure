/* eslint-disable global-require */

"use server";

import { AI_LAB_API_URL, AI_LAB_QUERY_URL } from "@/lib/constants";

export async function getImageURL(task_id: String) {
    // Use fetch-retry instead of fetch API
    const fetch = require("fetch-retry")(global.fetch);

    const resp = await fetch(`${AI_LAB_QUERY_URL}?task_id=${task_id}`, {
        headers: {
            "ailabapi-api-key": process.env.AI_LAB_TOOLS_API_KEY || ""
        },
        retryOn: async (attempt, error, response) => {
            if (attempt > 5) return false;

            // Check task_status with cloned json
            const json = await response.clone().json();

            // Validation
            // 1. The facial area must occupy at least 10% of the total area
            if (json.error_detail.message) return false;

            if (json.task_status !== 2) return true;
        }
    });

    const result = await resp.json();

    if (result.error_detail.message) {
        return { error: result.error_detail.message };
    }

    return result.data.images[0];
}

export async function request(formData: FormData) {
    formData.append("task_type", "async");

    const response = await fetch(AI_LAB_API_URL, {
        method: "post",
        headers: {
            "ailabapi-api-key": process.env.AI_LAB_TOOLS_API_KEY || ""
        },
        body: formData
    });

    const data = await response.json();

    // Validate API Key Existence
    if (data.message) {
        return { error: `${data.message}. Contact to Admin` };
    }

    // Validation
    // 1. Insufficient Credit
    // 2. Hairstyle Not Supported
    // 3. Image Cannot be empty
    // 4. Color Not Supported
    if (!response.ok) {
        return { error: data.error_detail.message };
    }

    const url = await getImageURL(data.task_id);

    return url;
}
