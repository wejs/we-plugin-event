module.exports = function getEmailTypes(plugin) {
  const we = plugin.we;

  return {
    CFContactSuccess: {
      label: 'E-mail confirmação de envio de contato de um evento',
      defaultSubject: `A sua mensagem foi enviada para o evento {{eventTitle}}`,
      defaultHTML: `<p>Oi {{name}},<p>

<p>Obrigado por entrar em contato.</p>

<p>A sua mensagem foi enviada com sucesso para o evento {{eventTitle}} .</p>

<br>

<p>
  Atenciosamente<br>
  Equipe <strong>{{eventTitle}}</strong><br>
  {{event.title}} - {{siteUrl}}/event/{{eventId}}
</p>
`,
      defaultText: `Oi {{name}},

Obrigado por entrar em contato.

A sua mensagem foi enviada com sucesso para o evento {{eventTitle}} .


Atenciosamente
Equipe "{{eventTitle}}"
{{event.title}} - {{siteUrl}}/event/{{eventId}}

`,
      templateVariables: {
        name: {
          example: 'Alberto Souza',
          description: 'Nome da pessoa ou organização que está entrando em contato'
        },
        email: {
          example: 'contact@linkysysytems.com',
          description: 'Email da pessoa ou organização que está entrando em contato'
        },
        message: {
          example: 'Example message',
          description: 'Mensagem da pessoa ou organização que está entrando em contato'
        },
        eventId: {
          example: '01',
          description: 'Id do evento / seminário'
        },
        eventTitle: {
          example: 'Seminário saúde e cultura',
          description: 'Tìtulo do evento / seminário'
        },
        siteName: {
          example: 'Site Name',
          description: 'Nome deste site'
        },
        siteUrl: {
          example: '/#example',
          description: 'Endereço deste site'
        }
      }
    },

    CFContactNewMessage: {
      label: 'Email de contato de um evento',
      defaultSubject: `Novo email do fale conosco no evento {{eventTitle}}`,
      defaultHTML: `<p>Caros gerentes do evento {{eventTitle}},</p>

<p>{{name}} enviou a mensagem:</p>

<p>{{message}}</p>
<p>Com o email: {{email}}</p>

<p>Atenciosamente<br>
  Equipe <strong>{{eventTitle}}</strong><br>
  {{event.title}} - {{siteUrl}}/event/{{eventId}}
</p>
`,
      defaultText: `Caros gerentes do evento {{eventTitle}},

{{name}} enviou a mensagem:

{{message}}
Com o email: {{email}}


Atenciosamente,
Equipe "{{eventTitle}}
{{event.title}} - {{siteUrl}}/event/{{eventId}}
`,
      templateVariables: {
        name: {
          example: 'Alberto Souza',
          description: 'Nome da pessoa ou organização que está entrando em contato'
        },
        email: {
          example: 'contact@linkysysytems.com',
          description: 'Email da pessoa ou organização que está entrando em contato'
        },
        message: {
          example: 'Example message',
          description: 'Mensagem da pessoa ou organização que está entrando em contato'
        },
        eventId: {
          example: '01',
          description: 'Id do evento / seminário'
        },
        eventTitle: {
          example: 'Seminário saúde e cultura',
          description: 'Tìtulo do evento / seminário'
        },
        siteName: {
          example: 'Site Name',
          description: 'Nome deste site'
        },
        siteUrl: {
          example: '/#example',
          description: 'Endereço deste site'
        }
      }
    },
    CFRegistrationSuccess: {
      label: 'E-mail confirmação de inscrição em um evento',
      defaultSubject: `Sua inscrição no evento foi realizada com sucesso`,
      defaultHTML: `<p>Oi {{name}},</p>

<p>Sua inscrição no evento <strong>{{eventTitle}}</strong> foi realizada com sucesso.</p>

<p>Link: {{siteUrl}}/event/{{eventId}}</p>

<p>
  Atenciosamente,<br>
  Equipe <strong>{{eventTitle}}</strong><br>
  {{event.title}} - {{siteUrl}}/event/{{eventId}}
</p>
`,
      defaultText: `Oi {{name}},

Sua inscrição no evento "{{eventTitle}}" foi realizada com sucesso.

Link: {{siteUrl}}/event/{{eventId}}


Atenciosamente,
Equipe "{{eventTitle}}"
{{event.title}} - {{siteUrl}}/event/{{eventId}}
`,
      templateVariables: {
        name: {
          example: 'Alberto Souza',
          description: 'Nome da pessoa ou organização que se inscreveu'
        },
        email: {
          example: 'contact@linkysysytems.com',
          description: 'Email da pessoa ou organização que se inscreveu'
        },
        eventId: {
          example: '01',
          description: 'Id do evento / seminário'
        },
        eventTitle: {
          example: 'Seminário saúde e cultura',
          description: 'Tìtulo do evento / seminário'
        },
        cfregistrationId: {
          example: 'Id da inscrição',
          description: 'Id da inscrição no evento'
        },
        siteName: {
          example: 'Site Name',
          description: 'Nome deste site'
        },
        siteUrl: {
          example: '/#example',
          description: 'Endereço deste site'
        }
      }
    },

    CFSessionRegisterSuccess: {
      label: 'E-mail confirmação de inscrição em uma atividade de evento',
      defaultSubject: `Sua inscrição na atividade {{cfsessionTitle}} foi realizada com sucesso`,
      defaultHTML: `<p>Oi {{name}},</p>

<p>Sua inscrição na atividade {{cfsessionTitle}} do evento <strong>{{eventTitle}}</strong> foi realizada com sucesso.</p>

<p>Link: {{siteUrl}}/event/{{eventId}}</p>

<p>
  Atenciosamente,<br>
  Equipe <strong>{{eventTitle}}</strong><br>
  {{event.title}} - {{siteUrl}}/event/{{eventId}}
</p>
`,
      defaultText: `Oi {{name}},

Sua inscrição na atividade {{cfsessionTitle}} do evento <strong>{{eventTitle}}</strong> foi realizada com sucesso.

Link: {{siteUrl}}/event/{{eventId}}


Atenciosamente,
Equipe "{{eventTitle}}"
{{event.title}} - {{siteUrl}}/event/{{eventId}}
`,
      templateVariables: {
        name: {
          example: 'Alberto Souza',
          description: 'Nome da pessoa ou organização que se inscreveu'
        },
        email: {
          example: 'contact@linkysysytems.com',
          description: 'Email da pessoa ou organização que se inscreveu'
        },
        cfsessionTitle: {
          example: 'Roda de conversa saúde e cultura',
          description: 'Tìtulo da atividade do evento'
        },
        eventId: {
          example: '01',
          description: 'Id do evento / seminário'
        },
        eventTitle: {
          example: 'Seminário saúde e cultura',
          description: 'Tìtulo do evento / seminário'
        },
        cfregistrationId: {
          example: 'Id da inscrição',
          description: 'Id da inscrição no evento'
        },
        siteName: {
          example: 'Site Name',
          description: 'Nome deste site'
        },
        siteUrl: {
          example: '/#example',
          description: 'Endereço deste site'
        }
      }
    }
  };
}