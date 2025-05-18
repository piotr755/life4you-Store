const { 
  Client, GatewayIntentBits, Partials, EmbedBuilder,
} = require('discord.js');
const express = require('express');
require('dotenv').config();

// --- Keep-alive ---
const app = express();
app.get('/', (req, res) => res.send('✅ Bot został uruchomiony poprawnie!'));
app.listen(3000, () => console.log('✅ Keep-alive działa.'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

function splitTextIntoFields(text) {
  return text.split('\n')
    .filter(line => line.trim())
    .map(line => ({
      name: '\u200B',
      value: line.trim(),
      inline: false
    }));
}

const TOKEN = 'MTM2ODU3Njg0OTg4NTY1OTMwNg.G2uiUb.Pr6Ddlg_MzBLb3pk2HG_MFmIgrxS8RgH8cHI_M' // token z .env
const VERIFY_ROLE_ID = '1351569276242362457';
const GUILD_ID = '1351569276225589359';
const VERIFY_LOG_CHANNEL_ID = '1373278252549799986';

async function sendLongRegulamin(channel) {
  const kolumny = [
    `**# 1. Postanowienia ogólne**  
    **1.1.** \`Dołączając do serwera, akceptujesz niniejszy regulamin.\`  
    **1.2.** \`Administracja zastrzega sobie prawo do modyfikacji regulaminu w dowolnym momencie.\`  
    **1.3.** \`Nieznajomość regulaminu nie zwalnia z jego przestrzegania.\`  
    **1.4.** \`Obowiązuje kultura osobista oraz wzajemny szacunek.\``,

    `**# 2. Zasady zachowania**  
    **2.1.** \`Szanuj wszystkich użytkowników – zakaz obrażania, grożenia, prowokowania, poniżania oraz dyskryminowania.\`  
    **2.2.** \`Zakaz używania wulgaryzmów i obraźliwego języka.\`  
    **2.3.** \`Zakaz publikowania treści NSFW, przemocy, gore, drastycznych lub nielegalnych.\`  
    **2.4.** \`Zakaz spamowania wiadomościami, zaproszeniami, emoji itp.\`  
    **2.5.** \`Zakaz wysyłania linków i reklam bez zgody administracji.\`  
    **2.6.** \`Zakaz podszywania się pod innych użytkowników.\`  
    **2.7.** \`Zakaz wyłudzania danych osobowych (phishing, scam).\`  
    **2.8.** \`Zakaz udostępniania cudzych danych osobowych (doxxing).\`  
    **2.9.** \`Zakaz trollowania, prowokowania i wprowadzania zamieszania.\`  
    **2.10.** \`Zakaz prowokowania dram i manipulacji decyzjami administracji.\``,

    `**# 3. Kanały tekstowe i głosowe**  
    **3.1.** \`Korzystaj z kanałów zgodnie z ich przeznaczeniem.\`  
    **3.2.** \`Zakaz floodowania – nadmiernego wysyłania wiadomości.\`  
    **3.4.** \`Zakaz nagrywania rozmów bez zgody uczestników.\`  
    **3.5.** \`Zakaz nadużywania caps locka, znaków specjalnych i dziwnego formatowania.\`  
    **3.6.** \`Memy, gify i multimedia tylko w odpowiednich kanałach.\`  
    **3.7.** \`Zakaz przesyłania plików z wirusami lub szkodliwym oprogramowaniem.\``,

    `**# 4. Regulamin serwera FiveM Life4You**  
    🔗 **[REGULAMIN FIVEM](https://docs.google.com/document/d/17uXb7UdVpuqrMFIWj0He-x9NrrPlw8v5srcv0g_VyUM/edit?usp=sharing)**  
    \`Regulamin obowiązuje wszystkich graczy serwera Life4You RP na platformie FiveM.\`  
    - Zasady RolePlay (RP)  
    - Zakazy cheatów, metagamingu, powergamingu  
    - System kar i zgłaszanie naruszeń  
    - Zasady IC/OOC  
    🛑 \`Każdy gracz ma obowiązek znać i przestrzegać regulaminu.\``,

    `**# 5. Zasady dotyczące administracji i moderacji**  
    **5.1.** \`Decyzje administracji są ostateczne i niepodważalne.\`  
    **5.2.** \`Administracja nie ma obowiązku tłumaczenia wszystkich decyzji.\`  
    **5.3.** \`Nadużywanie ticketów i pingów administracji grozi karą.\`  
    **5.4.** \`Pytania i zgłoszenia kieruj we właściwe miejsca.\`  
    **5.5.** \`Podszywanie się pod administrację = natychmiastowy ban.\``,

    `**# 6. Kary i sankcje**  
    **6.1.** \`Każde naruszenie regulaminu grozi karą: ostrzeżenie, mute, kick, ban.\`  
    **6.2.** \`Poważne wykroczenia karane są natychmiastowo.\`  
    **6.3.** \`Obchodzenie kary (alt konta) = permanentny ban.\`  
    **6.4.** \`Odwołania tylko przez wyznaczone kanały i ticket.\``,

    `**# 7. Zasady bezpieczeństwa**  
    **7.1.** \`Nie udostępniaj swoich danych logowania.\`  
    **7.2.** \`Zgłaszaj scamy, phishing i podejrzane linki.\`  
    **7.3.** \`Nie klikaj podejrzanych linków od obcych.\`  
    **7.4.** \`Nie publikuj cudzych danych bez zgody.\``,

    `**# 8. Postanowienia końcowe**  
    **8.1.** \`Regulamin obowiązuje wszystkich – bez wyjątków.\`  
    **8.2.** \`W razie niejasności decyzję podejmuje administracja.\`  
    **8.3.** \`Spamowanie prywatnych wiadomości grozi karą.\`  
    **8.4.** \`Administracja ma prawo reagować w sytuacjach nieobjętych regulaminem.\`  

    **# 💛 Dziękujemy za przestrzeganie zasad i życzymy przyjemnego korzystania z serwera Life4You!**`
  ];

  const embeds = [];
  for (let i = 0; i < kolumny.length; i += 3) {
    const fields = kolumny.slice(i, i + 3).flatMap(splitTextIntoFields);
    embeds.push(new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`📜 Regulamin serwera Life4You (${Math.floor(i / 3) + 1}/3)`)
      .addFields(fields));
  }

  return await channel.send({ embeds });
}

async function sendVerificationLog(type, member, resultText) {
  const logChannel = await client.channels.fetch(VERIFY_LOG_CHANNEL_ID).catch(() => null);
  if (logChannel) {
    await logChannel.send({
      content: `${type === 'success' ? '✅' : '❌'} ${member} ${resultText}`
    });
  }
}

client.once('ready', () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!regulamin') {
    const sentMessage = await sendLongRegulamin(message.channel);
    try {
      await sentMessage.react('✅');
    } catch (err) {
      console.error('Nie udało się dodać reakcji:', err);
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Błąd podczas fetchowania reakcji:', error);
      return;
    }
  }
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error('Błąd podczas fetchowania wiadomości:', error);
      return;
    }
  }

  if (reaction.emoji.name === '✅' &&
      reaction.message.embeds.length > 0 &&
      reaction.message.embeds[0].title?.startsWith('📜 Regulamin serwera Life4You')) {

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;
    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    if (member.roles.cache.has(VERIFY_ROLE_ID)) return;

    try {
      await member.roles.add(VERIFY_ROLE_ID);
      await sendVerificationLog('success', member.toString(), 'Został zweryfikowany przez reakcję.');

      try {
        await user.send('✅ Dziękujemy za zapoznanie się z regulaminem! Zostałeś zweryfikowany.');
      } catch {
        // DM może być zablokowane
      }
    } catch (err) {
      console.error('Błąd przy nadawaniu roli:', err);
    }
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Błąd podczas fetchowania reakcji:', error);
      return;
    }
  }
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error('Błąd podczas fetchowania wiadomości:', error);
      return;
    }
  }

  if (reaction.emoji.name === '✅' &&
      reaction.message.embeds.length > 0 &&
      reaction.message.embeds[0].title?.startsWith('📜 Regulamin serwera Life4You')) {

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;
    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    if (!member.roles.cache.has(VERIFY_ROLE_ID)) return;

    try {
      await member.roles.remove(VERIFY_ROLE_ID);
      await sendVerificationLog('fail', member.toString(), 'Cofnął weryfikację (usunął reakcję).');
      try {
        await user.send('❌ Usunąłeś reakcję weryfikacyjną, rola została zdjęta.');
      } catch {}
    } catch (err) {
      console.error('Błąd przy usuwaniu roli:', err);
    }
  }
});

// Usuń reakcję użytkownika po wyjściu z serwera
client.on('guildMemberRemove', async (member) => {
  if (member.guild.id !== GUILD_ID) return;

  try {
    const channel = await client.channels.fetch(VERIFY_LOG_CHANNEL_ID).catch(() => null);
    if (!channel?.isText()) return;

    const messages = await channel.messages.fetch({ limit: 50 });
    const regulaminMessage = messages.find(msg =>
      msg.embeds.length > 0 &&
      msg.embeds[0].title?.startsWith('📜 Regulamin serwera Life4You')
    );
    if (!regulaminMessage) return;

    const reaction = regulaminMessage.reactions.cache.get('✅');
    if (!reaction) return;

    await reaction.users.remove(member.id).catch(console.error);

    console.log(`Usunięto reakcję weryfikacyjną użytkownika ${member.user.tag}, który opuścił serwer.`);
  } catch (error) {
        console.error('Błąd przy usuwaniu reakcji użytkownika, który opuścił serwer:', error);
      }
    });


client.login(TOKEN);
