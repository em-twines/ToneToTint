import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../src/app/components/Form";
import "openai/shims/node";
import { jest } from '@jest/globals';


    describe('tests for form html elements', () => {
        it('should have an input field', () => {
            render(<Form/>) 
            const input = screen.getByTestId('inputValue');
            expect(input).toBeVisible(); 
        })
    
        it('should have a submit button', () => {
            render(<Form/>) 
            const button = screen.getByTestId('submitPhraseButton');
            expect(button).toBeVisible(); 
        })
   
    });

    describe('tests for api call', () => {
        it('should parse api response', async () => {
            const apiMock = jest.fn<() => Promise<any>>().mockResolvedValue(
                {
                    "id": "chatcmpl-9BsmbJsFRVtIntEsfu7UPl3MJtWjN",
                    "object": "chat.completion",
                    "created": 1712619221,
                    "model": "gpt-3.5-turbo-0125",
                    "choices": [
                        {
                            "index": 0,
                            "message": {
                                "role": "assistant",
                                "content": "{\n    \"css_code\": \"background-color: #FFD700;\"\n}"
                            },
                            "logprobs": null,
                            "finish_reason": "stop"
                        }
                    ],
                    "usage": {
                        "prompt_tokens": 53,
                        "completion_tokens": 16,
                        "total_tokens": 69
                    },
                    "system_fingerprint": "fp_b28b39ffa8"
                }
            )
        const openaiResponse = await apiMock(); 
        expect(openaiResponse.choices[0].message.content).toBe("{\n    \"css_code\": \"background-color: #FFD700;\"\n}");
    });

});
 