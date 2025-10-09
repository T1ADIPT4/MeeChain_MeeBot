# Fallback Logs Directory

This directory stores fallback and error logs from the MeeChain quest system.

Logs are automatically written here when:
- Fallback minting occurs
- Badge minting fails
- Quest verification errors happen
- Any error-level events are logged

## Log Files

- `fallback-*.log` - Fallback minting events
- `error-*.log` - Error events
- Logs are timestamped for easy tracking

## Usage

Logs are automatically created during:
- Test runs (when errors/fallback occur)
- Production operation (for debugging)

Check these logs when investigating:
- Failed badge mints
- Fallback minting events
- Quest verification issues

## MeeBot Sprite: Logger Ready! 📝

🎨 **MeeBot-LoggerReady**
- Pose: Holding clipboard + pen, ready to write logs
- Colors: Blue–White–Gray
- Message: "Fallback logger system ready to use!"
