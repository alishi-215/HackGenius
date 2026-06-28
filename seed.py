from app import create_app
from models import db, Category, Tool

def seed_data():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        # Categories
        categories_data = [
            "Network Scanning",
            "Vulnerability Assessment",
            "Penetration Testing",
            "Packet Sniffers / Analyzers",
            "Wireless Network Tools"
        ]
        
        category_map = {}
        for cat_name in categories_data:
            cat = Category.query.filter_by(name=cat_name).first()
            if not cat:
                cat = Category(name=cat_name, description=f"Tools for {cat_name}")
                db.session.add(cat)
                db.session.commit() # Commit to get ID
            category_map[cat_name] = cat.id

        # Tools
        tools_data = [
            # Network Scanning
            {"name": "Nmap", "category": "Network Scanning", "desc": "Network Mapper", "cmd": "nmap -A <target>", "comp": "Medium", "lic": "Open Source", "perf": "Standard, flexible"},
            {"name": "Zenmap", "category": "Network Scanning", "desc": "Nmap GUI", "cmd": "zenmap", "comp": "Low", "lic": "Open Source", "perf": "GUI based"},
            {"name": "Netdiscover", "category": "Network Scanning", "desc": "Active/passive scanner", "cmd": "netdiscover -r <range>", "comp": "Low", "lic": "Open Source", "perf": "Fast for ARP"},
            {"name": "Angry IP Scanner", "category": "Network Scanning", "desc": "Fast IP scanner", "cmd": "GUI based", "comp": "Low", "lic": "Open Source", "perf": "Fast ping scan"},
            {"name": "Masscan", "category": "Network Scanning", "desc": "Mass IP scanner", "cmd": "masscan <ip> -p80", "comp": "High", "lic": "Open Source", "perf": "Extremely fast, less detailed"},
            {"name": "ARP-scan", "category": "Network Scanning", "desc": "ARP scanner", "cmd": "arp-scan -l", "comp": "Low", "lic": "Open Source", "perf": "Local network only"},

            # Vulnerability Assessment
            {"name": "Tenable Nessus", "category": "Vulnerability Assessment", "desc": "Standard vulnerability scanner", "cmd": "Web UI", "comp": "Medium", "lic": "Commercial", "perf": "Comprehensive"},
            {"name": "Nikto", "category": "Vulnerability Assessment", "desc": "Web server scanner", "cmd": "nikto -h <url>", "comp": "Low", "lic": "Open Source", "perf": "Noisy, thorough"},
            {"name": "Nmap Vuln Scripts", "category": "Vulnerability Assessment", "desc": "NSE scripts", "cmd": "nmap --script vuln <target>", "comp": "Medium", "lic": "Open Source", "perf": "Varies by script"},
            {"name": "Wapiti", "category": "Vulnerability Assessment", "desc": "Web application scanner", "cmd": "wapiti -u <url>", "comp": "Medium", "lic": "Open Source", "perf": "Black-box testing"},
            {"name": "Dirbuster", "category": "Vulnerability Assessment", "desc": "Directory brute force", "cmd": "GUI/CLI", "comp": "Low", "lic": "Open Source", "perf": "Intensive"},
            {"name": "OpenVAS", "category": "Vulnerability Assessment", "desc": "Legacy/Hard to Maintain", "cmd": "openvas-start", "comp": "High", "lic": "Open Source", "perf": "Resource heavy"},

            # Penetration Testing
            {"name": "Metasploit Framework", "category": "Penetration Testing", "desc": "Exploitation framework", "cmd": "msfconsole", "comp": "High", "lic": "Open Source/Pro", "perf": "Industry standard"},
            {"name": "SQLMap", "category": "Penetration Testing", "desc": "SQL Injection tool", "cmd": "sqlmap -u <url>", "comp": "Medium", "lic": "Open Source", "perf": "Automated injection"},
            {"name": "Commix", "category": "Penetration Testing", "desc": "Command Injection tool", "cmd": "commix --url=<url>", "comp": "Medium", "lic": "Open Source", "perf": "Automated os command injection"},

            # Packet Sniffers
            {"name": "Wireshark", "category": "Packet Sniffers / Analyzers", "desc": "Packet analyzer", "cmd": "wireshark", "comp": "Medium", "lic": "Open Source", "perf": "Deep inspection"},
            {"name": "Tcpdump", "category": "Packet Sniffers / Analyzers", "desc": "CLI packet analyzer", "cmd": "tcpdump -i eth0", "comp": "Medium", "lic": "Open Source", "perf": "Lightweight"},
            {"name": "Ettercap", "category": "Packet Sniffers / Analyzers", "desc": "MITM tool", "cmd": "ettercap -G", "comp": "Medium", "lic": "Open Source", "perf": "network interception"},
            {"name": "NetworkMiner", "category": "Packet Sniffers / Analyzers", "desc": "Network forensic", "cmd": "GUI", "comp": "Low", "lic": "Open Source/Pro", "perf": "Passive sniffing"},
            {"name": "NetH0r", "category": "Packet Sniffers / Analyzers", "desc": "Network analysis", "cmd": "neth0r", "comp": "Medium", "lic": "Open Source", "perf": "Unknown"},

            # Wireless
            {"name": "Aircrack-ng Suite", "category": "Wireless Network Tools", "desc": "WiFi security auditing", "cmd": "airmon-ng start wlan0", "comp": "High", "lic": "Open Source", "perf": "Powerful suite"},
            {"name": "Wash", "category": "Wireless Network Tools", "desc": "WPS scanner", "cmd": "wash -i wlan0mon", "comp": "Low", "lic": "Open Source", "perf": "WPS specific"},
            {"name": "Reaver", "category": "Wireless Network Tools", "desc": "WPS brute force", "cmd": "reaver -i wlan0mon -b <bssid>", "comp": "Medium", "lic": "Open Source", "perf": "Time consuming"},
            {"name": "Wifite", "category": "Wireless Network Tools", "desc": "Automated wireless attack", "cmd": "wifite", "comp": "Low", "lic": "Open Source", "perf": "Automates other tools"}
        ]

        for t_data in tools_data:
            if not Tool.query.filter_by(name=t_data["name"]).first():
                tool = Tool(
                    name=t_data["name"],
                    description=t_data["desc"],
                    category_id=category_map[t_data["category"]],
                    command_usage=t_data["cmd"],
                    complexity=t_data["comp"],
                    license=t_data["lic"],
                    performance_notes=t_data["perf"]
                )
                db.session.add(tool)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
