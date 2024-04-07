"use client";

import React, { useState, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import OpenAI from "openai";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

//TODO: add unit and integration tests

type FormValues = {
  inputValue: string;
};

const Form = () => {
  const [colorResponse, setColorResponse] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormValues>({});

  // api call to mood to color
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_COLOR_KEY,
    dangerouslyAllowBrowser: true,
  });

  const getColorApi = async (content: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in json with a single key called "css_code".',
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    //parse the response:
    let splitResponse = response.choices[0].message.content?.split(": ");
    // console.log(response.choices[0].message.content)

    if (splitResponse) {
      //if format is rgb:
      if (splitResponse[1].includes("rgb")) {
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
        const hexCode = substring.substring(0, 7);
        setColorResponse(hexCode);
      }
      // add third optioin to catch if format returns a color (e.g. "orange")
    }
    //clear the form fields and reset isDirty etc
    reset();
  };

  //on button press:
  const onSubmit = async (data: FormValues) => {
    setContent(data.inputValue);
  };

  useEffect(() => {
    // when React registers the state change, call the api function, passing that state value as a param to keep in sync.
    if (content) {
        let _content = content;
        getColorApi(_content);
    }
  }, [content]);

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
                id="submitPhrase"
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
