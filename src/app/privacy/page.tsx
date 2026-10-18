import type { Metadata } from "next";
import { Doc } from "@/components/Doc";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Morse Code collects no personal data. It works offline and only uses the vibration motor.",
};

export default function Privacy() {
  return (
    <Doc title="Privacy policy" updated="18 October 2026">
      <p>
        This policy covers the <strong>Morse Code</strong> Android app (package <code>com.hexhad.morsecode</code>) and this website,
        both made by HEXHAD (Hashan Dharmapriya, Colombo, Sri Lanka).
      </p>
      <h2>The short version</h2>
      <p>Morse Code does not collect, store on a server, share or sell any personal data. It works fully offline.</p>
      <h2>What the app does with your data</h2>
      <ul>
        <li><strong>Your messages</strong> are encoded to Morse on your device and played on the vibration motor. They are not saved and never leave the phone.</li>
        <li><strong>Settings</strong>: your theme choice (System, Light or Dark, and dynamic color) is saved in the app&apos;s private storage on your device, so it is there next time. If Android backup is on, this setting can be included in your device&apos;s own backup, which is handled by Google under your account, not by us. It contains no personal data.</li>
        <li><strong>No network</strong>: the app does not request the internet permission and makes no network requests.</li>
        <li><strong>No accounts, ads, analytics or tracking</strong>: the app contains no advertising, analytics, crash-reporting or tracking SDKs.</li>
      </ul>
      <h2>Permissions</h2>
      <ul>
        <li><strong>Vibrate</strong> (<code>android.permission.VIBRATE</code>): to play Morse code as vibration. This is the only permission the app uses.</li>
      </ul>
      <p>
        The &quot;Made by HEXHAD&quot; link in the app&apos;s settings opens hexhad.github.io in your browser. What happens there is covered by
        your browser and that site, not by the app.
      </p>
      <h2>This website</h2>
      <p>
        This site is static. It sets no cookies and runs no analytics. The Morse demo runs in your browser; what you type is not sent
        anywhere. Like any web host, the hosting provider may keep standard server logs such as IP addresses.
      </p>
      <h2>Deleting your data</h2>
      <p>
        There is nothing for us to delete, because we hold no data about you. To remove the saved theme setting from your phone, clear the
        app&apos;s storage in Android Settings or uninstall the app.
      </p>
      <h2>Children</h2>
      <p>The app collects no data from anyone, including children.</p>
      <h2>Changes</h2>
      <p>If this policy changes, the new version will be posted on this page with a new date.</p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </Doc>
  );
}
