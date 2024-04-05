"use client"

import React, {useState, Fragment} from 'react';
import { useForm } from "react-hook-form";
import OpenAI from "openai";

//TODO: add support for return press submit
//TODO: check responsive design
//TODO: implement ui library
//TODO: make robust error handling
//TODO: add unit and integration tests

type FormValues = {
    inputValue: string
  }

const Form = () => {
    const [colorResponse, setColorResponse] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormValues>({
  });

  // api call to mood to color
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_COLOR_KEY,
    dangerouslyAllowBrowser: true,
  });

  //on button press:
  const onSubmit = async (data: FormValues) => {
    const messages = [
        {
        "role": "system",
        "content": "You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in json with a single key called \"css_code\"."
        },
        {
        "role": "user",
        "content": data.inputValue
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })

    //parse the response
    let splitResponse = response.choices[0].message.content.split(": ");
    //if format is rgb:
    if (splitResponse[1].includes("rgb")) {
        const substring = response.choices[0].message.content.split("\"");
        const rgbPlus = substring[3]
        let rgb: string = ""; 
        for (let i=0; i<(rgbPlus.length); i++){
            rgb+=(rgbPlus[i]);
        }
        setColorResponse(rgb);
    } else {
        //if format is a hex code:
        let splitResponse = response.choices[0].message.content.split(": ");
        const substring = splitResponse[2]
        const hexCode = substring.substr(0, 7)
        setColorResponse(hexCode);
    }
    //clear the form fields and reset isDirty etc
    reset();
    
};

  return (
    <Fragment>
        <div className="flex flex-col justify-center items-center">                
        <div className="w-full max-w-xs flex flex-col items-center">
            {/* Form header*/}
            <h1 className="pt-10">Tone To Tint</h1>
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
                    className ="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="inputValue"
                >Phrase*
                </label>
                <input
                {...register("inputValue", { required: true })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-12" 
                    id="inputValue"
                    name="inputValue"
                    placeholder="Blue sky at dawn."
                    autoComplete="off"
                    aria-required="true"
                />
                {errors?.inputValue && (
                    <p>{errors?.inputValue?.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    role="button"
                    id="submitPhrase"
                >Submit</button>
            </div>
            </form>
        
        <h2 className="px-4">Input a word or poetic turn of phrase to generate a corresponding color.</h2>  
     </div>
     
     {/* Color Output */}
     <div className="flex mt-4 h-14 w-14">
        <div style={colorResponse ? {backgroundColor: colorResponse, width:100, borderRadius:5 } : {backgroundColor: "rgb(138, 182, 214)", width:100, borderRadius: 5}}></div>
        </div>
    </div>
    </Fragment>
  )
};

export default Form;