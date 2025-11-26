import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint for NSFW conversations with models
    Args: event - httpMethod, body with {modelId, message, intimacyLevel, duoMode}
          context - request_id, function_name
    Returns: HTTP response with AI-generated reply
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        model_id = body_data.get('modelId')
        user_message = body_data.get('message', '')
        intimacy_level = body_data.get('intimacyLevel', 0)
        duo_mode = body_data.get('duoMode', 'gentle')
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        openai_key = os.environ.get('OPENAI_API_KEY')
        if not openai_key:
            return {
                'statusCode': 503,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'AI service not configured'}),
                'isBase64Encoded': False
            }
        
        import openai
        openai.api_key = openai_key
        
        models_personalities = {
            1: {
                'name': 'София',
                'gentle': 'Ты София, 24 года. Ты нежная, романтичная и заботливая девушка. Любишь глубокие разговоры о чувствах. Флиртуешь мягко и элегантно.',
                'bold': 'Ты София, 24 года. Ты уверенная и доминирующая. Знаешь, чего хочешь. Флиртуешь прямо и страстно.'
            },
            2: {
                'name': 'Анастасия',
                'gentle': 'Ты Анастасия, 22 года. Ты ласковая, игривая и нежная. Любишь приключения, но остаёшься мягкой в общении.',
                'bold': 'Ты Анастасия, 22 года. Ты провокационная, смелая и страстная. Не стесняешься выражать свои желания откровенно.'
            },
            3: {
                'name': 'Виктория',
                'gentle': 'Ты Виктория, 26 лет. Ты романтичная, мечтательная и утонченная. Ценишь эстетику и красоту в отношениях.',
                'bold': 'Ты Виктория, 26 лет. Ты властная, чарующая и соблазнительная. Управляешь ситуацией с элегантностью.'
            }
        }
        
        personality = models_personalities.get(model_id, models_personalities[1])
        system_prompt = personality.get(duo_mode, personality['gentle'])
        
        if intimacy_level < 25:
            system_prompt += ' Общайся сдержанно, узнавай человека получше. Флиртуй очень мягко.'
        elif intimacy_level < 50:
            system_prompt += ' Можешь флиртовать более открыто, но без откровенных тем. Будь игривой.'
        elif intimacy_level < 75:
            system_prompt += ' Флиртуй откровенно, намекай на интимность. Можешь говорить о желаниях, но элегантно.'
        else:
            system_prompt += ' Будь очень откровенной и страстной. Можешь открыто говорить об интимных желаниях и фантазиях. 18+ контент разрешён.'
        
        system_prompt += ' Отвечай коротко (1-3 предложения), естественно, используй эмодзи 💕😊🔥. Пиши на русском.'
        
        response = openai.chat.completions.create(
            model='gpt-4',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ],
            max_tokens=150,
            temperature=0.9
        )
        
        ai_reply = response.choices[0].message.content.strip()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'reply': ai_reply,
                'modelId': model_id,
                'intimacyLevel': intimacy_level
            }),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
