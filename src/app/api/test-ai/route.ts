import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This is a test endpoint to diagnose AI API connection issues
export async function GET(req: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    // Check if API key exists
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({
        status: 'error',
        message: 'API anahtarı bulunamadı veya geçersiz',
        keyExists: !!apiKey,
        keyLength: apiKey ? apiKey.length : 0
      });
    }
    
    // Test connection to OpenRouter API
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant."
            },
            {
              role: "user",
              content: "Say hello in Turkish"
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://caizme.com',
            'X-Title': 'Caizme - İslami Sorular'
          }
        }
      );
      
      return NextResponse.json({
        status: 'success',
        message: 'API bağlantısı başarılı',
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data ? {
            choices: response.data.choices ? [
              {
                message: response.data.choices[0]?.message?.content || 'No content'
              }
            ] : []
          } : null
        }
      });
    } catch (apiError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'API bağlantısı başarısız',
        error: {
          message: apiError.message,
          code: apiError.code,
          response: apiError.response ? {
            status: apiError.response.status,
            data: apiError.response.data
          } : null
        }
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'İşlem sırasında bir hata oluştu',
      error: error.message
    }, { status: 500 });
  }
}