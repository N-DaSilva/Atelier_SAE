using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using UnityEngine.InputSystem;
using System;

public class ExampleScript : MonoBehaviour
{
    [SerializeField]
    private TextMeshProUGUI text_object;
    [SerializeField]
    private TextMeshProUGUI input_display;

    private List<string> alphabet;
    private List<string> pressed_letters = new List<string>();
    private string displayed_text;
    private int letter_number;
    public int player_amount = 10;

    void Start()
    {
        alphabet = new List<string> { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" };

        Keyboard.current.onTextInput += OnTextInput;

        GenerateString();
    }

    private void GenerateString()
    {
        pressed_letters.Clear();
        letter_number = 0;

        displayed_text = "";
        for (int i = 0; i < player_amount; i++)
        {
            displayed_text += alphabet[UnityEngine.Random.Range(0, alphabet.Count)];
        }
        text_object.text = displayed_text;
        input_display.text = "";
    }

    public void OnButtonClick()
    {
        GenerateString();
    }

    public void OnTextInput(char c)
    {
        var input = c.ToString().ToUpper();

        if (alphabet.Contains(input))
        {
            pressed_letters.Add(input);
            input_display.text+=input;

            letter_number = pressed_letters.Count;

            Debug.Log(letter_number);

            

            if (displayed_text[letter_number-1] == c)
            {
                Debug.Log("yay");
            } else
            {
                Debug.Log(":(");
            }
        }
    }
}