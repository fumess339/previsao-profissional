import gradio as gr
import openai
import os

# Configure sua chave da OpenAI (de preferência via Secrets do Hugging Face)
openai.api_key = os.getenv("OPENAI_API_KEY", "sk-sua-chave-aqui")

def analisar_texto_curriculo(texto):
    if not texto.strip():
        return "Por favor, insira o texto do currículo."

    prompt = (
        "Analise o seguinte currículo e me diga: nome da pessoa, experiências anteriores, "
        "formação acadêmica, habilidades principais e possíveis áreas de atuação:\n\n"
        + texto
    )

    try:
        resposta = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=700
        )
        return resposta.choices[0].message.content

    except Exception as e:
        return f"Erro ao processar: {str(e)}"

# Interface do Gradio
demo = gr.Interface(
    fn=analisar_texto_curriculo,
    inputs=gr.Textbox(label="Cole aqui o texto do currículo", lines=20, placeholder="Cole o texto do currículo aqui..."),
    outputs=gr.Textbox(label="Análise da IA"),
    title="Analisador de Currículos com IA",
    description="Cole abaixo o texto do seu currículo e receba uma análise inteligente com recomendações."
)

# Iniciar app no Hugging Face Spaces
demo.launch()
