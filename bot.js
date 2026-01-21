import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import mongoose from "mongoose";

/* ===================== CONFIG ===================== */
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const MONGO_URI = process.env.MONGODB_URI;

if (!TOKEN || !CLIENT_ID || !MONGO_URI) {
  throw new Error(" Missing env variables");
}

/* ===================== DATABASE ===================== */
await mongoose.connect(MONGO_URI);
console.log("MongoDB connected");

const settingsSchema = new mongoose.Schema({
  guildId: { type: String, unique: true },
  enabled: { type: Boolean, default: true },
  welcomeChannelId: String,
  welcomeMessage: {
    type: String,
    default: "Welcome {user} to **{server}**! ",
  },
  sendDM: { type: Boolean, default: false },
  dmMessage: {
    type: String,
    default: "Welcome {user} to **{server}**! Enjoy your stay ",
  },
  autoRoleId: String,
});

const Settings = mongoose.model("Settings", settingsSchema);

async function getSettings(guildId) {
  let s = await Settings.findOne({ guildId });
  if (!s) s = await Settings.create({ guildId });
  return s;
}

/* ===================== UTIL ===================== */
function formatMessage(template, member) {
  return template
    .replaceAll("{user}", `<@${member.id}>`)
    .replaceAll("{username}", member.user.username)
    .replaceAll("{tag}", member.user.tag)
    .replaceAll("{server}", member.guild.name)
    .replaceAll("{memberCount}", member.guild.memberCount.toString());
}

/* ===================== CLIENT ===================== */
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

/* ===================== SLASH COMMAND ===================== */
const welcomeCommand = new SlashCommandBuilder()
  .setName("welcome")
  .setDescription("Configure welcome system")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

  .addSubcommand((s) =>
    s
      .setName("channel")
      .setDescription("Set the welcome channel")
      .addChannelOption((o) =>
        o
          .setName("channel")
          .setDescription("Channel where welcome messages will be sent")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
  )

  .addSubcommand((s) =>
    s
      .setName("message")
      .setDescription("Set the welcome message template")
      .addStringOption((o) =>
        o
          .setName("text")
          .setDescription("Template: {user} {server} {memberCount} {username} {tag}")
          .setRequired(true)
      )
  )

  .addSubcommand((s) =>
    s
      .setName("dm")
      .setDescription("Enable/disable welcome DM and optionally set DM message")
      .addBooleanOption((o) =>
        o
          .setName("enabled")
          .setDescription("Send a DM to new members?")
          .setRequired(true)
      )
      .addStringOption((o) =>
        o
          .setName("message")
          .setDescription("Optional DM template (same placeholders as welcome)")
          .setRequired(false)
      )
  )

  .addSubcommand((s) =>
    s
      .setName("autorole")
      .setDescription("Set or clear an auto-role for new members")
      .addRoleOption((o) =>
        o
          .setName("role")
          .setDescription("Role to assign to new members (leave empty to clear)")
          .setRequired(false)
      )
  )

  .addSubcommand((s) =>
    s
      .setName("toggle")
      .setDescription("Enable/disable the welcome system for this server")
  )

  .addSubcommand((s) =>
    s
      .setName("config")
      .setDescription("Show the current welcome configuration")
  );


/* ===================== DEPLOY COMMAND ===================== */
const rest = new REST({ version: "10" }).setToken(TOKEN);
await rest.put(Routes.applicationCommands(CLIENT_ID), {
  body: [welcomeCommand.toJSON()],
});
console.log("Slash command deployed");
/* ===================== EVENTS ===================== */
client.once("ready", () => {
  console.log(` Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "welcome") return;

  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guildId;
  const settings = await getSettings(guildId);

  if (sub === "channel") {
    settings.welcomeChannelId =
      interaction.options.getChannel("channel").id;
  }

  if (sub === "message") {
    settings.welcomeMessage =
      interaction.options.getString("text");
  }

  if (sub === "dm") {
    settings.sendDM =
      interaction.options.getBoolean("enabled");
    const msg = interaction.options.getString("message");
    if (msg) settings.dmMessage = msg;
  }

  if (sub === "autorole") {
    const role = interaction.options.getRole("role");
    settings.autoRoleId = role ? role.id : null;
  }

  if (sub === "toggle") {
    settings.enabled = !settings.enabled;
  }

  if (sub === "config") {
    return interaction.reply({
      content:
        `**Welcome Config**\n` +
        `Enabled: ${settings.enabled}\n` +
        `Channel: ${settings.welcomeChannelId ? `<#${settings.welcomeChannelId}>` : "None"}\n` +
        `Message: \`${settings.welcomeMessage}\`\n` +
        `DM: ${settings.sendDM}\n` +
        `AutoRole: ${settings.autoRoleId ? `<@&${settings.autoRoleId}>` : "None"}`,
      ephemeral: true,
    });
  }

  await settings.save();
  await interaction.reply({ content: "Updated!", ephemeral: true });
});

client.on("guildMemberAdd", async (member) => {
  const s = await getSettings(member.guild.id);
  if (!s.enabled) return;

  if (s.autoRoleId) {
    const role = member.guild.roles.cache.get(s.autoRoleId);
    if (role) await member.roles.add(role).catch(() => {});
  }

  if (s.welcomeChannelId) {
    const ch = member.guild.channels.cache.get(s.welcomeChannelId);
    if (ch) {
      ch.send(formatMessage(s.welcomeMessage, member)).catch(() => {});
    }
  }

  if (s.sendDM) {
    member.send(formatMessage(s.dmMessage, member)).catch(() => {});
  }
});

/* ===================== LOGIN ===================== */
client.login(TOKEN);
client.login();
