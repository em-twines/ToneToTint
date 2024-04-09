"use client";

import React, { useState, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
// TODO: import below is necessary for jest testing, but breaks npm run dev
// import "openai/shims/node";
import OpenAI from "openai";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { ChatCompletion } from "openai/resources/index.mjs";
import { toast } from 'react-hot-toast';

type FormValues = {
  inputValue: string;
};

const Form = () => {
  const [colorResponse, setColorResponse] = useState<string>("");
  const response = {
    id: "chatcmpl-abc123",
    object: "chat.completion",
    created: 1677858242,
    model: "gpt-3.5-turbo-0613",
    usage: {
      prompt_tokens: 13,
      completion_tokens: 7,
      total_tokens: 20,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content:
            '{\n    "css_code": "/* Please provide a mood description to generate the CSS code for a matching color */"\n}',
        },
        logprobs: null,
        finish_reason: "stop",
        index: 0,
      },
    ],
  };
  const messageRef = useRef(response.choices[0].message.content.toString());

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormValues>({});

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_COLOR_KEY,
    dangerouslyAllowBrowser: true,
  });


  // api call to mood to color
  const getColorApi = async (content: string) => {
    // we will try the call up to and including 5 times since it often fails to return a color,
    // but after 5, we will show an error message and break. 
    
    let response: ChatCompletion | undefined; 
    let counter = 0; 
    do{    
      const messages: any = [
        {
          role: "system",
          content:
            'You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in json with a single key called "css_code".',
        },
        {
          role: "user",
          content: content,
        },
      ];

      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      if (response.choices[0].message.content) {
        messageRef.current = response.choices[0].message.content.toString();
      }    
      counter ++; 
    } while (messageRef.current.includes("Please provide") && counter <= 5);

    if (counter >=5&& messageRef.current.includes("Please provide")) {
      toast.error('Failed to return a color from the api endpoint! Darned AI!');
      counter = 0; 
    };
    return response;
  }


  //on button press:
  const onSubmit = async (data: FormValues) => {
    if (!isSubmitting) {
      if (data.inputValue) {
          await getColorApi(data.inputValue).then((res) => {
            determineColor(res);
          });
        }
      }
  };

  const determineColor = (response: any) => {
    let splitResponse = response.choices[0].message.content?.split(": ");

    if (splitResponse) {
      //if format is rgb:
      if (splitResponse[1]?.includes("rgb")) {
        const substring = response.choices[0].message.content?.split('"');
        if (substring) {
          const rgbPlus = substring[3];
          let rgb: string = "";
          for (let i = 0; i < rgbPlus.length; i++) {
            rgb += rgbPlus[i];
          }
          setColorResponse(rgb);
        }
      } else {
        // if format is a hex code:
        const substring = splitResponse[2];
        const hexCode = substring?.substring(0, 7);
        setColorResponse(hexCode);
      }
      // add third option to catch if format returns a color (e.g. "orange") 
      // or returns a non-standard reply (like "your CSS code here")
    }
    //clear the form fields and reset isDirty etc
    reset();
  };

  return (
    <Fragment>
      <div className="flex flex-col justify-center items-center pt-12">
        <div className="w-full max-w-xs flex flex-col items-center">
          {/* Form header*/}
          <h1 className="pb-4 text-lg">Tone To Tint</h1>
          {/* Color Output */}
          <div className="flex mt-4 h-24 w-24">
            <div
              style={
                colorResponse
                  ? {
                      backgroundColor: colorResponse,
                      width: 100,
                      borderRadius: 5,
                    }
                  : {
                      backgroundColor: "rgb(113, 151, 166)",
                      width: 100,
                      borderRadius: 5,
                    }
              }
            ></div>
          </div>
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            action=""
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
            role="form"
          >
            {/* Input */}
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="inputValue"
              >
                Phrase*
              </label>
              <Input
                {...register("inputValue", { required: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-12"
                id="inputValue"
                name="inputValue"
                data-testid="inputValue"
                placeholder="Raindrops on roses."
                autoComplete="off"
                aria-required="true"
              />
              {errors?.inputValue && <p>{errors?.inputValue?.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                variant="contained"
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
                role="button"
                id="submitPhraseButton"
                data-testid="submitPhraseButton"
              >
                Submit
              </Button>
            </div>
          </form>

          <h2 className="text-center px-4">
            Input a word or poetic turn of phrase to generate a corresponding
            color.
          </h2>
        </div>
      </div>
    </Fragment>
  );
};

export default Form;
