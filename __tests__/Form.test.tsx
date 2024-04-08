import { render, screen } from "@testing-library/react";
import Form from "../src/app/components/Form";
import "openai/shims/node";
import OpenAI from 'openai';

    it('should have an input field', () => {
        // arrange
        render(<Form/>) 
        // act
        const input = screen.getByTestId('inputValue');
        // assert
        expect(input).toBeVisible(); 
    })

    it('should have a button', () => {
        // arrange
        render(<Form/>) 
        // act
        const input = screen.getByTestId('submitPhraseButton');
        // assert
        expect(input).toBeVisible(); 
    })



    // it('should return api response', () => {
        
    // mock call to ai api
//     return jest.fn().mockImplementation(() => {
//         return {
//             chat: {
//                 completions: {
//                     create: jest.fn().mockImplementation(async() => {
//                         return{ choices: [{message: {content: "hello!"}}]};
//                     })
//                 }
//             }
//         }
//     })
// })    
//      TODO: complete testing of api call here
//         ...
//         expect(openaiResponse.choices[0].message.content).toBe("hello!");
// })

