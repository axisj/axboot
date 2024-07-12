#!/usr/bin/env node
import path from "path";
import prompts from "prompts";
async function readTemplates() {
    const p = path.join(__dirname, "templates");
    // Classic should be first in list!
    return;
}
export default async function init() {
    console.log("Welcome to the AxBoot Create App CLI");
    const questions = [
        {
            type: "text",
            name: "name",
            message: "What is the name of your app?",
        },
        {
            type: "select",
            name: "template",
            message: "What template would you like to use?",
            choices: [
                { title: "Classic", value: "classic" },
                { title: "Modern", value: "modern" },
            ],
        },
    ];
    const response = await prompts(questions);
    console.log(response);
}
